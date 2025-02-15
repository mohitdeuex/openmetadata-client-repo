#  Copyright 2021 Collate
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#  http://www.apache.org/licenses/LICENSE-2.0
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
"""
Bigquery Incremental Table processing logic
"""
from datetime import datetime
from typing import List, Optional

import google.cloud.logging
from google.cloud.logging_v2.entries import LogEntry

from metadata.ingestion.source.database.bigquery.models import (
    BigQueryTable,
    BigQueryTableMap,
    TableName,
)
from metadata.ingestion.source.database.bigquery.queries import (
    BIGQUERY_GET_CHANGED_TABLES_FROM_CLOUD_LOGGING,
)


class BigQueryIncrementalTableProcessor:
    def __init__(self, client: google.cloud.logging.Client):
        self._client = client
        self._changed_tables_map: Optional[BigQueryTableMap] = None

    @classmethod
    def from_project(cls, project: str) -> "BigQueryIncrementalTableProcessor":
        client = google.cloud.logging.Client(project=project)
        return cls(client)

    def _is_table_deleted(self, entry: LogEntry) -> bool:
        if "tableDeletion" in entry.payload.get("metadata").keys():
            return True
        return False

    def set_changed_tables_map(self, project: str, dataset: str, start_date: datetime):
        if self._changed_tables_map:
            return

        table_map = {}

        resource_names = [f"projects/{project}"]
        filters = BIGQUERY_GET_CHANGED_TABLES_FROM_CLOUD_LOGGING.format(
            project=project,
            dataset=dataset,
            start_date=start_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
        )

        entries = self._client.list_entries(
            resource_names=resource_names,
            filter_=filters,
            order_by=google.cloud.logging.DESCENDING,
        )

        for entry in entries:
            table_name = entry.payload.get("resourceName", "").split("/")[-1]
            timestamp = entry.timestamp
            deleted = self._is_table_deleted(entry)

            if table_name not in table_map:
                table_map[table_name] = BigQueryTable(
                    name=table_name, timestamp=timestamp, deleted=deleted
                )
        self._changed_tables_map = BigQueryTableMap(table_map=table_map)

    def get_deleted(self) -> List[TableName]:
        if self._changed_tables_map:
            return self._changed_tables_map.get_deleted()
        return []

    def get_not_deleted(self) -> List[TableName]:
        if self._changed_tables_map:
            return self._changed_tables_map.get_not_deleted()
        return []

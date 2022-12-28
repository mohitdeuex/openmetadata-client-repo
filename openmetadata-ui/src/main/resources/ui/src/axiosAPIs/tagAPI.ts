/*
 *  Copyright 2022 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { AxiosResponse } from 'axios';
import { CreateClassification } from '../generated/api/classification/createClassification';
import { CreateTag } from '../generated/api/classification/createTag';
import { Classification } from '../generated/entity/classification/classification';
import { Tag } from '../generated/entity/classification/tag';
import { TagsCategory } from '../pages/tags/tagsTypes';
import { getURLWithQueryFields } from '../utils/APIUtils';
import APIClient from './index';

const BASE_URL = '/classifications';

export const getTags = async (arrQueryFields?: string | string[]) => {
  const url = getURLWithQueryFields('/tags', arrQueryFields);

  const response = await APIClient.get<{ data: Classification[] }>(url);

  return response.data;
};

export const getClassification = async (
  name: string,
  arrQueryFields?: string | string[]
) => {
  const url = getURLWithQueryFields(`${BASE_URL}/name/${name}`, arrQueryFields);

  const response = await APIClient.get<Classification>(url);

  return response.data;
};

export const deleteClassification = async (classificationId: string) => {
  const response = await APIClient.delete<Classification>(
    `/classifications/${classificationId}`
  );

  return response.data;
};

export const createClassification = async (data: CreateClassification) => {
  const response = await APIClient.post<
    TagsCategory,
    AxiosResponse<Classification>
  >(BASE_URL, data);

  return response.data;
};
export const updateClassification = async (data: Classification) => {
  const response = await APIClient.put<
    Classification,
    AxiosResponse<Classification>
  >(`/classifications`, data);

  return response.data;
};

export const createTag = async (data: CreateTag) => {
  const response = await APIClient.post<CreateTag, AxiosResponse<Tag>>(
    `/tags`,
    data
  );

  return response.data;
};

export const updateTag = async (data: TagsCategory) => {
  const response = await APIClient.put(`/tags`, data);

  return response.data;
};

export const deleteTag = async (tagId: string) => {
  const response = await APIClient.delete(`/tags/${tagId}`, {
    // Todo: need to update below params in new implementation, for now providing hardDelete true,
    // to avoid soft delete issue from UI
    params: {
      recursive: true,
      hardDelete: true,
    },
  });

  return response.data;
};

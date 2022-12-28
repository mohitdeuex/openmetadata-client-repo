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

import { TagsCategory } from '../pages/tags/tagsTypes';
import {
  createClassification,
  createTag,
  deleteClassification,
  deleteTag,
  getClassification,
  getTags,
  updateClassification,
  updateTag,
} from './tagAPI';

jest.mock('../utils/APIUtils', () => ({
  getURLWithQueryFields: jest
    .fn()
    .mockImplementation(
      (url, lstQueryFields) => `${url}?fields=${lstQueryFields}`
    ),
}));

jest.mock('./index', () => ({
  get: jest
    .fn()
    .mockImplementation((url) =>
      Promise.resolve({ data: `get_request${url}` })
    ),
  delete: jest
    .fn()
    .mockImplementation((url) =>
      Promise.resolve({ data: `delete_request${url}` })
    ),
  post: jest.fn().mockImplementation((url, data) =>
    Promise.resolve({
      data: { url: `post_request${url}`, data },
    })
  ),
  put: jest.fn().mockImplementation((url, data) =>
    Promise.resolve({
      data: { url: `put_request${url}`, data },
    })
  ),
}));

describe('API functions should work properly', () => {
  it('getTags function should work properly', async () => {
    const data = await getTags('querry');

    expect(data).toEqual(`get_request/tags?fields=querry`);
  });

  it('getClassification function should work properly', async () => {
    const result = await getClassification('categoryName', 'querry');

    expect(result).toEqual(
      `get_request/classifications/name/categoryName?fields=querry`
    );
  });

  it('deleteClassification function should work properly', async () => {
    const result = await deleteClassification('classificationId');

    expect(result).toEqual(`delete_request/classifications/classificationId`);
  });

  // TODO:9259 deleting tag with classificationId?
  it('deleteTag function should work properly', async () => {
    const result = await deleteTag('classificationId');

    expect(result).toEqual(`delete_request/tags/classificationId`);
  });

  it('createClassification function should work properly', async () => {
    const mockPostData = { name: 'testCategory' } as TagsCategory;
    const result = await createClassification(mockPostData);

    expect(result).toEqual({
      url: `post_request/classifications`,
      data: mockPostData,
    });
  });

  it('createTag function should work properly', async () => {
    const mockPostData = { name: 'newTag' } as TagsCategory;
    const result = await createTag(mockPostData);

    expect(result).toEqual({
      url: `post_request/tags`,
      data: mockPostData,
    });
  });

  it('updateClassification function should work properly', async () => {
    const mockUpdateData = {
      name: 'testCategory',
      description: 'newDescription',
    };
    const result = await updateClassification(mockUpdateData);

    expect(result).toEqual({
      url: `put_request/classifications`,
      data: mockUpdateData,
    });
  });

  it('updateTag function should work properly', async () => {
    const mockUpdateData = {
      name: 'tagName',
      description: 'newDescription',
    };
    const result = await updateTag(mockUpdateData);

    expect(result).toEqual({
      url: `put_request/tags`,
      data: mockUpdateData,
    });
  });
});

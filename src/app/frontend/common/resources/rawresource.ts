// Copyright 2017 The Kubernetes Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {ObjectMeta, TypeMeta} from '@api/backendapi';

export class RawResource {
  static getUrl(tenant: string, typeMeta: TypeMeta, objectMeta: ObjectMeta): string {
    let resourceUrl = 'api/v1' + (tenant ? `/tenants/${tenant}` : '') + `/_raw/${typeMeta.kind}`;
    if (objectMeta.namespace !== undefined) {
      resourceUrl += `/namespace/${objectMeta.namespace}`;
    }
    resourceUrl += `/name/${objectMeta.name}`;

    if (resourceUrl.includes('/tenant/name')) {
      resourceUrl = 'api/v1/tenants' + `/${objectMeta.name}`
    }
    if (resourceUrl.includes('role/')) {
      resourceUrl = `api/v1/namespaces/${objectMeta.namespace}/${typeMeta.kind}/${objectMeta.name}`;
    }
    return resourceUrl;
  }
}

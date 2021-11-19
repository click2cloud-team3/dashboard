// Copyright 2020 Authors of Arktos.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';

import {CLUSTER_ROUTE} from '../routing';

import {TenantNewListComponent} from './list/component';
import {TenantNewDetailComponent} from './detail/component';

const TENANTNEW_LIST_ROUTE: Route = {
  path: '',
  component: TenantNewListComponent,
  data: {
    breadcrumb: 'TenantNew',
    parent: CLUSTER_ROUTE,
  },
};

const TENANTNEW_DETAIL_ROUTE: Route = {
  path: ':resourceName',
  component: TenantNewDetailComponent,
  data: {
    breadcrumb: '{{ resourceName }}',
    parent: TENANTNEW_LIST_ROUTE,
  },
};

@NgModule({
  imports: [RouterModule.forChild([TENANTNEW_LIST_ROUTE, TENANTNEW_DETAIL_ROUTE])],
  exports: [RouterModule],
})
export class TenantNewRoutingModule {}
 
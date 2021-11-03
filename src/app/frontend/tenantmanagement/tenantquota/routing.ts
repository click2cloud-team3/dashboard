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

import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';

import {TENANTMANAGEMENT_ROUTE} from '../routing';
import {DEFAULT_ACTIONBAR} from "../../common/components/actionbars/routing";
import {TenantQuotaDetailComponent} from 'tenantmanagement/tenantquota/detail/component';
import {TenantQuotaListComponent} from 'tenantmanagement/tenantquota/list/component';

const QUOTASNAMESPACE_LIST_ROUTE: Route = {
  path: '',
  component: TenantQuotaListComponent,
  data: {
    breadcrumb: 'Quota',
    parent: TENANTMANAGEMENT_ROUTE,
  },
};

const QUOTASNAMESPACE_DETAIL_ROUTE: Route = {
  path: ':resourceName',
  component: TenantQuotaDetailComponent,
  data: {
    breadcrumb: ' {{ resourceName }} ',
    parent: QUOTASNAMESPACE_LIST_ROUTE,
  },
};



@NgModule({
  imports: [RouterModule.forChild([QUOTASNAMESPACE_LIST_ROUTE, QUOTASNAMESPACE_DETAIL_ROUTE])],
  exports: [RouterModule],
})
export class TenantQuotasRoutingModule {}

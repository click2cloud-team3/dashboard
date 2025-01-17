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
import {TenantMonitoringListComponent} from "./list/component";
import {TENANTMANAGEMENT_ROUTE} from "../routing";
import {TenantMonitoringDetailComponent} from "./detail/component";
import {DEFAULT_ACTIONBAR} from "../../../common/components/actionbars/routing";

const TENANTMONITORING_LIST_ROUTE: Route = {
  path: '',
  component: TenantMonitoringListComponent,
  data: {
    breadcrumb: 'Tenant Monitoring',
    parent: TENANTMANAGEMENT_ROUTE,
  },
};


const TENANTMONITORING_DETAIL_ROUTE: Route = {
  path: ':resourceName',
  component: TenantMonitoringDetailComponent,
  data: {
    breadcrumb: ' {{ resourceName }} ',
    parent: TENANTMONITORING_LIST_ROUTE,
  },
};

@NgModule({
  imports: [RouterModule.forChild([TENANTMONITORING_LIST_ROUTE, TENANTMONITORING_DETAIL_ROUTE, DEFAULT_ACTIONBAR])],
  exports: [RouterModule],
})
export class TenantMonitoringRoutingModule {}

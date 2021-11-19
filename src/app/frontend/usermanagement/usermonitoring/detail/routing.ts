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
// import {ActionbarComponent} from '../product/actionbar/component';
import {UserMonitoringDetailComponent} from "usermanagement/usermonitoring/detail/component";
import {UserMonitoringListComponent} from "usermanagement/usermonitoring/list/component";
import {DEFAULT_ACTIONBAR} from "../../../common/components/actionbars/routing";
import {USERMANAGEMENT_ROUTE} from "../../routing";

const TENANTHEALTHDETAIL_LIST_ROUTE: Route = {
  path: '',
  component: UserMonitoringListComponent,
  data: {
    breadcrumb: 'User Monitoring',
    parent: USERMANAGEMENT_ROUTE,
  },
};


const TENANTHEALTHDETAIL_DETAIL_ROUTE: Route = {
  path: ':resourceName',
  component: UserMonitoringDetailComponent,
  data: {
    breadcrumb: '{{ resourceName }}',
    parent: TENANTHEALTHDETAIL_LIST_ROUTE,
  },
};

@NgModule({
  imports: [RouterModule.forChild([ DEFAULT_ACTIONBAR ,TENANTHEALTHDETAIL_LIST_ROUTE ,TENANTHEALTHDETAIL_DETAIL_ROUTE])],
  exports: [RouterModule],
})
export class UserMonitoringDetailRoutingModule {}

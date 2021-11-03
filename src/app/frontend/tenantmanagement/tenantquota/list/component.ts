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

import {ResourceListWithStatuses} from "../../../common/resources/list";
import {Node, NodeList} from "@api/backendapi";
import {EndpointManager, Resource} from "../../../common/services/resource/endpoint";
import {ResourceService} from "../../../common/services/resource/resource";
import {NotificationsService} from "../../../common/services/global/notifications";
import {
  ListGroupIdentifier,
  ListIdentifier
} from "../../../common/components/resourcelist/groupids";
import {MenuComponent} from "../../../common/components/list/column/menu/component";
import {HttpParams} from '@angular/common/http';
import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'kd-quota-list-img',
  templateUrl: './template.html'
})
export class TenantQuotaListComponent  {


}

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

import {Component,Input, OnInit} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ResourceListWithStatuses} from "../../../common/resources/list";
import {Tenant, TenantList} from "@api/backendapi";
import {EndpointManager, Resource} from "../../../common/services/resource/endpoint";
import {ResourceService} from "../../../common/services/resource/resource";
import {NotificationsService} from "../../../common/services/global/notifications";
import {
  ListGroupIdentifier,
  ListIdentifier
} from "../../../common/components/resourcelist/groupids";
import {MenuComponent} from "../../../common/components/list/column/menu/component";
import {UsersDetailComponent} from "../detail/component";

@Component({
  selector: 'kd-users-img',
  template: '<kd-tenant-list></kd-tenant-list>'
})
export class UsersListComponent {



}

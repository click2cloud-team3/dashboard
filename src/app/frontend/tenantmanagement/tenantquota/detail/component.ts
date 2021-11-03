// Copyright 2017 The Kubernetes Authors.
// Copyright 2020 Authors of Arktos - file modified.
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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NamespaceDetail, NodeAddress, NodeDetail, NodeTaint} from '@api/backendapi';
import {Subscription} from 'rxjs/Subscription';

import {ActionbarService, ResourceMeta} from '../../../common/services/global/actionbar';
import {NotificationsService} from '../../../common/services/global/notifications';
import {EndpointManager, Resource} from '../../../common/services/resource/endpoint';
import {ResourceService} from '../../../common/services/resource/resource';

@Component({
  selector: 'kd-quotas-img',
  templateUrl: './template.html'
})
export class TenantQuotaDetailComponent  {

imageofquota:string ="../assets/images/kubernetes-logo.png"


}

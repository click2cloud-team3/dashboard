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
//
// import {Component, Inject} from '@angular/core';
// import {VersionInfo} from '@api/frontendapi';
// import {AssetsService} from '../common/services/global/assets';
// import {ConfigService} from '../common/services/global/config';
//
// @Component({
//   selector: 'kd-information',
//   templateUrl: './template.html',
//   styleUrls: ['./style.scss'],
// })
//
//
// export class InformationComponent {
//   // latestCopyrightYear: number;
//   // versionInfo: VersionInfo;
//   //
//   // constructor(@Inject(AssetsService) public assets: AssetsService, config: ConfigService) {
//   //   this.versionInfo = config.getVersionInfo();
//   //   this.latestCopyrightYear = new Date().getFullYear();
//   // }
//
//
// }


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

import {HttpParams} from '@angular/common/http';
import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Secret, SecretList} from 'typings/backendapi';
import {ResourceListBase} from '../common/resources/list';
import {NotificationsService} from '../common/services/global/notifications';
import {EndpointManager, Resource} from '../common/services/resource/endpoint';
import {NamespacedResourceService} from '../common/services/resource/resource';
import {MenuComponent} from '../common/components/list/column/menu/component';
import {ListGroupIdentifier, ListIdentifier} from '../common/components/resourcelist/groupids';
import {GroupedResourceList} from "../common/resources/groupedlist";
import {TenantService} from "../common/services/global/tenant";
import {CONFIG} from "../index.config";

@Component({
  selector: 'kd-usermanagement',
  templateUrl: './template.html'
})

export class UserManagementComponent extends GroupedResourceList {
  constructor(private readonly tenantService_: TenantService) {
    super();
  }

  get isCurrentSystem(): boolean {
    return this.tenantService_.current() === CONFIG.systemTenantName;
  }
}

// Copyright 2020 Authors of Arktos.
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
import {Tenant, TenantList} from '@api/backendapi';
import {Observable} from 'rxjs/Observable';

import {ResourceListWithStatuses} from '../../../resources/list';
import {EndpointManager, Resource} from '../../../services/resource/endpoint';
import {ResourceService} from '../../../services/resource/resource';
import {NotificationsService} from '../../../services/global/notifications';
import {ListGroupIdentifier, ListIdentifier} from '../groupids';
import {MenuComponent} from '../../list/column/menu/component';
import {VerberService} from '../../../services/global/verber';
import {ActivatedRoute} from "@angular/router";
import {isNil} from "lodash";

@Component({
  selector: 'kd-tenant-list',
  templateUrl: './template.html',
})
export class TenantListComponent extends ResourceListWithStatuses<TenantList, Tenant> {
  @Input() endpoint = EndpointManager.resource(Resource.tenant).list();
  displayName:any;
  typeMeta:any;
  objectMeta:any;
  nodeName: any
  clusterName: any
  tenantList: Tenant[]
  tenantCount: number

  constructor(
    readonly verber_: VerberService,
    private readonly tenant_: ResourceService<TenantList>,
    private readonly route_: ActivatedRoute,
    notifications: NotificationsService,
  ) {
    super('tenant', notifications);
    this.id = ListIdentifier.tenant;
    this.groupId = ListGroupIdentifier.cluster;

    this.nodeName = this.route_.snapshot.params.resourceName

    // Register status icon handlers
    this.registerBinding(this.icon.checkCircle, 'kd-success', this.isInSuccessState);
    this.registerBinding(this.icon.error, 'kd-error', this.isInErrorState);

    // Register action columns.
    this.registerActionColumn<MenuComponent>('menu', MenuComponent);
  }

  getResourceObservable(params?: HttpParams): Observable<TenantList> {
    return this.tenant_.get(this.endpoint, undefined, params);
  }

  map(tenantList: TenantList): Tenant[] {
    this.tenantList = []
    this.tenantCount = 0
    if (isNil(this.nodeName) && tenantList.tenants != null){
      this.tenantList = tenantList.tenants
      this.tenantCount = this.tenantList.length
    }
    return this.tenantList;
  }

  isInErrorState(resource: Tenant): boolean {
    return resource.phase === 'Terminating';
  }

  isInSuccessState(resource: Tenant): boolean {
    return resource.phase === 'Active';
  }

  getDisplayColumns(): string[] {
    return ['statusicon', 'clusterName', 'name', 'phase', 'age'];
  }

  getDisplayColumns2(): string[] {
    return ['statusicon', 'clusterName', 'name', 'phase', 'age'];
  }

  //added the code
  onClick(): void {
    this.verber_.showTenantCreateDialog(this.displayName, this.typeMeta, this.objectMeta);  //changes needed
  }
}

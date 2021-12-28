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

import {Component,Input} from '@angular/core';
import {ResourceListWithStatuses} from "../../../../common/resources/list";
import {Namespace, NamespaceList} from "@api/backendapi";
import {EndpointManager, Resource} from "../../../../common/services/resource/endpoint";
import {VerberService} from "../../../../common/services/global/verber";
import {ResourceService} from "../../../../common/services/resource/resource";
import {NotificationsService} from "../../../../common/services/global/notifications";
import {
  ListGroupIdentifier,
  ListIdentifier
} from "../../../../common/components/resourcelist/groupids";
import {MenuComponent} from "../../../../common/components/list/column/menu/component";
import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'kd-namespace-list-view',
  template: '<kd-namespace-list></kd-namespace-list>',
})
export class NamespaceListComponent extends ResourceListWithStatuses<NamespaceList, Namespace> {
  @Input() endpoint = EndpointManager.resource(Resource.namespace, false, true).list();
  displayName:any="";
  typeMeta:any="";
  objectMeta:any;
  constructor(
    private readonly verber_: VerberService,
    private readonly namespace_: ResourceService<NamespaceList>,
    notifications: NotificationsService,
  ) {
    super('namespace', notifications);
    this.id = ListIdentifier.namespace;
    this.groupId = ListGroupIdentifier.cluster;

    // Register status icon handlers
    this.registerBinding(this.icon.checkCircle, 'kd-success', this.isInSuccessState);
    this.registerBinding(this.icon.error, 'kd-error', this.isInErrorState);

    // Register action columns.
    this.registerActionColumn<MenuComponent>('menu', MenuComponent);
  }

  getResourceObservable(params?: HttpParams): Observable<NamespaceList> {
    return this.namespace_.get(this.endpoint, undefined, params);
  }

  map(namespaceList: NamespaceList): Namespace[] {
    return namespaceList.namespaces;
  }

  isInErrorState(resource: Namespace): boolean {
    return resource.phase === 'Terminating';
  }

  isInSuccessState(resource: Namespace): boolean {
    return resource.phase === 'Active';
  }

  getDisplayColumns(): string[] {
    return ['statusicon', 'name', 'labels', 'phase', 'age'];
  }
  getDisplayColumns2(): string[] {
    return ['statusicon', 'name', 'nodecount', 'cpulim', 'memlim', 'tentcount', 'health', 'etcd'];
  }
  //added the code
  onClick(): void {
    this.verber_.showNamespaceCreateDialog(this.displayName, this.typeMeta, this.objectMeta); //added showNamespaceCreateDialog
  }
}

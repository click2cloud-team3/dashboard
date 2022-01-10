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
import {User, UserList} from '@api/backendapi';
import {Observable} from 'rxjs/Observable';

import {ResourceListWithStatuses} from '../../../resources/list';
import {EndpointManager, Resource} from '../../../services/resource/endpoint';
import {ResourceService} from '../../../services/resource/resource';
import {NotificationsService} from '../../../services/global/notifications';
import {ListGroupIdentifier, ListIdentifier} from '../groupids';
import {MenuComponent} from '../../list/column/menu/component';
import {UserApi} from "../../../../../frontend/common/services/global/userapi"
import {VerberService} from "../../../../../frontend/common/services/global/verber"

@Component({
  selector: 'kd-user-list',
  templateUrl: './template.html',
})

export class TenantUserListComponent extends ResourceListWithStatuses<UserList, User> {
  @Input() endpoint = EndpointManager.resource(Resource.user).list();

  displayName:any;
  typeMeta:any;
  objectMeta:any;

  constructor(
    public readonly verber_: VerberService,
    private readonly user_: ResourceService<UserList>,
    private userAPI_:UserApi,
    notifications: NotificationsService,
  ) {
    super('user', notifications);
    this.id = ListIdentifier.user;
    this.groupId = ListGroupIdentifier.cluster;

    // Register status icon handlers
    this.registerBinding(this.icon.checkCircle, 'kd-success', this.isInSuccessState);
    this.registerBinding(this.icon.error, 'kd-error', this.isInErrorState);

    // Register action columns.
    this.registerActionColumn<MenuComponent>('menu', MenuComponent);
  }

  getResourceObservable(params?: HttpParams): Observable<UserList> {
    return this.user_.get(this.endpoint, undefined, params);
  }

  map(userList: UserList): User[] {
    return userList.users;
  }

  isInErrorState(resource: User): boolean {
    return resource.phase === 'Terminating';
  }

  isInSuccessState(resource: User): boolean {
    return resource.phase === 'Active';
  }

  getDisplayColumns(): string[] {
    return ['statusicon', 'username', 'phase', 'type'];
  }

  getDisplayColumns2(): string[] {
    return ['statusicon', 'username', 'phase', 'type'];
  }

  //added the code
  onClick(): void {
    this.verber_.showUserCreateDialog(this.displayName, this.typeMeta, this.objectMeta);  //changes needed
  }

  deleteUser(userID:string): void {
    this.userAPI_.deleteUser(userID).subscribe();
  }

}

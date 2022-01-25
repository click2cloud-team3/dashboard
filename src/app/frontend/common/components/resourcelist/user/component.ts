import {HttpParams} from '@angular/common/http';
import {Component, Input, ViewChild} from '@angular/core';
import {User, UserList} from '@api/backendapi';
import {Observable} from 'rxjs/Observable';
import {MatDrawer} from '@angular/material';

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

export class UserListComponent extends ResourceListWithStatuses<UserList, User> {
  @Input() endpoint = EndpointManager.resource(Resource.user).list();
  @ViewChild(MatDrawer, {static: true}) private readonly nav_: MatDrawer;

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
    const userType=sessionStorage.getItem('userType');
    const data=userList.users
    const userdata:any=[];
    data.map((elem)=>{
      if(userType.split("-")[0]==='tenant')
      {
        if (elem.objectMeta.type.includes('tenant')) {
          return userdata.push(elem)
        }
      }
      else {
        return userdata.push(elem)
      }
    })
    return userdata
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

  onClick(): void {
    this.verber_.showUserCreateDialog(this.displayName, this.typeMeta, this.objectMeta);
  }

  deleteUser(userID:string): void {
    this.userAPI_.deleteUser(userID).subscribe();
  }

}

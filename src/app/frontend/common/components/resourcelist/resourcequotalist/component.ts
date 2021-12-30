import {HttpParams} from '@angular/common/http';
import {Component, Input} from '@angular/core';
import {ResourceQuota, ResourceQuotaList} from '@api/backendapi';
import {Observable} from 'rxjs/Observable';

import {ResourceListWithStatuses} from '../../../resources/list';
import {EndpointManager, Resource} from '../../../services/resource/endpoint';
import {NamespacedResourceService} from '../../../services/resource/resource';
import {NotificationsService} from '../../../services/global/notifications';
import {ListGroupIdentifier, ListIdentifier} from '../groupids';
import {MenuComponent} from '../../list/column/menu/component';
import {MatDialog} from '@angular/material/';

import {VerberService} from '../../../services/global/verber';

@Component({
  selector: 'kd-resourcequota-list',
  templateUrl: './template.html',
})
export class ResourceQuotasListComponent extends ResourceListWithStatuses<ResourceQuotaList, ResourceQuota> {
  @Input() endpoint = EndpointManager.resource(Resource.resourcequota, true, true).list();
  displayName:any="";
  typeMeta:any="";
  objectMeta:any;

  constructor(
    private readonly verber_: VerberService,
    private readonly resourcequota_: NamespacedResourceService<ResourceQuotaList>, notifications: NotificationsService,
    private dialog: MatDialog //add the code
  ) {

    super('resourcequota', notifications);
    this.id = ListIdentifier.resourcequota;
    this.groupId = ListGroupIdentifier.cluster;

    // Register action columns.
    this.registerActionColumn<MenuComponent>('menu', MenuComponent);

    this.registerBinding(this.icon.checkCircle, 'kd-success', this.isInSuccessState);
  }

  isInSuccessState(): boolean {
    return true;
  }

  getResourceObservable(params?: HttpParams): Observable<ResourceQuotaList> {
    return this.resourcequota_.get(this.endpoint, undefined, undefined, params);
  }

  map(resourcequotaList: ResourceQuotaList): ResourceQuota[] {
    console.log("resourcequotaList",resourcequotaList)
    return resourcequotaList.items;
  }

  getDisplayColumns(): string[] {
    return ['statusicon', 'name', 'namespace', 'age', 'status'];
  }

  getDisplayColumns2(): string[] {
    return ['statusicon', 'name', 'namespace', 'age', 'status'];
  }

  //added the code
  onClick(): void {
    this.verber_.showResourceQuotaCreateDialog(this.displayName, this.typeMeta, this.objectMeta);  //changes needed
  }
}

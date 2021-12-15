
import {Component, Input} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {ResourceQuotaDetail} from 'typings/backendapi';
import {HttpParams} from '@angular/common/http';
import {Quota, QuotaList} from '@api/backendapi';
import {Observable} from 'rxjs/Observable';
import {ResourceListWithStatuses} from '../../../resources/list';
import {EndpointManager, Resource} from '../../../services/resource/endpoint';
import {ResourceService} from '../../../services/resource/resource';
import {NotificationsService} from '../../../services/global/notifications';
import {ListGroupIdentifier, ListIdentifier} from '../groupids';
import {MenuComponent} from '../../list/column/menu/component';
import {MatDialog, MatDialogConfig,MatExpansionModule} from '@angular/material/';
import { CreateFromFormComponent } from 'create/from/form/component';
import { CreatorCardComponent } from 'common/components/creator/component';
import { CreateFromFileComponent } from 'create/from/file/component';
import { Form } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';

import {VerberService} from '../../../services/global/verber';


@Component({
  selector: 'kd-quota-list',
  templateUrl: './template.html',
})
export class QuotaListComponent extends ResourceListWithStatuses<QuotaList, Quota>{
  @Input() initialized: boolean;
  @Input() quotas: ResourceQuotaDetail[];
  @Input() endpoint = EndpointManager.resource(Resource.quota).list();
  displayName:any="";
  typeMeta:any="";
  objectMeta:any;

  constructor(
    private readonly verber_: VerberService,
    private readonly quota_: ResourceService<QuotaList>,
    notifications: NotificationsService,
    private dialog: MatDialog //add the code
  ) {
    super('quota', notifications);
    this.id = ListIdentifier.quota;
    this.groupId = ListGroupIdentifier.cluster;

    // Register status icon handlers
    this.registerBinding(this.icon.checkCircle, 'kd-success', this.isInSuccessState);
    this.registerBinding(this.icon.error, 'kd-error', this.isInErrorState);

    // Register action columns.
    this.registerActionColumn<MenuComponent>('menu', MenuComponent);
  }
  getResourceObservable(params?: HttpParams): Observable<QuotaList> {
    return this.quota_.get(this.endpoint, undefined, params);
  }

  map(tenantList: QuotaList): Quota[] {
    return tenantList.quotas;
  }

  isInErrorState(resource: Quota): boolean {
    return resource.ready === 'Terminating';
  }

  isInSuccessState(resource: Quota): boolean {
    return resource.ready === 'Active';
  }


  getDisplayColumns(): string[] {
    return ['name', 'age', 'status'];
  }

  getDataSource(): MatTableDataSource<ResourceQuotaDetail> {
    const tableData = new MatTableDataSource<ResourceQuotaDetail>();
    tableData.data = this.quotas;
    return tableData;
  }

  onClick(): void {
    this.verber_.showTenantCreateDialog(this.displayName, this.typeMeta, this.objectMeta);  //changes needed
  }

}




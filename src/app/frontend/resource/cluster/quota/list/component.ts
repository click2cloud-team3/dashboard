import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NodeDetail} from '@api/backendapi';
import {Subscription} from 'rxjs/Subscription';

import {ActionbarService, ResourceMeta} from '../../../../common/services/global/actionbar';
import {NotificationsService} from '../../../../common/services/global/notifications';
import {EndpointManager, Resource} from '../../../../common/services/resource/endpoint';
import {ResourceService} from '../../../../common/services/resource/resource';
import {VerberService} from "../../../../common/services/global/verber";

@Component({
  selector: 'kd-quota-list-state',
  templateUrl: './template.html',
  styleUrls: ['./style.scss'],
})


export class QuotaListComponent{
  private nodeSubscription_: Subscription;
  private readonly endpoint_ = EndpointManager.resource(Resource.node);
  node: NodeDetail;
  isInitialized = false;
  displayName: any = "";
  typeMeta: any = "";
  objectMeta: any = "";

  constructor(
    private readonly node_: ResourceService<NodeDetail>,
    private readonly actionbar_: ActionbarService,
    private readonly activatedRoute_: ActivatedRoute,
    private readonly notifications_: NotificationsService,
    private readonly verber_: VerberService,
  ) {}
  ngOnInit(): void {
    const resourceName = "centaurus-master";
    console.log(this.node)
    this.nodeSubscription_ = this.node_
      .get(this.endpoint_.detail(), resourceName)
      .subscribe((d: NodeDetail) => {
        this.node = d;
        this.notifications_.pushErrors(d.errors);
        this.actionbar_.onInit.emit(new ResourceMeta('Node', d.objectMeta, d.typeMeta));
        this.isInitialized = true;
      });
  }

  //added the code
  onClick(): void {
    this.verber_.showQuotaCreateDialog(this.displayName, this.typeMeta, this.objectMeta);
  }

}

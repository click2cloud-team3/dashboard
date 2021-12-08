import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NodeDetail} from '@api/backendapi';
import {Subscription} from 'rxjs/Subscription';

import {ActionbarService, ResourceMeta} from '../../../common/services/global/actionbar';
import {NotificationsService} from '../../../common/services/global/notifications';
import {EndpointManager, Resource} from '../../../common/services/resource/endpoint';
import {ResourceService} from '../../../common/services/resource/resource';

@Component({
  selector: 'kd-tenantmonitoring-list',
  template: '',

})


export class TenantMonitoringListComponent{
  private nodeSubscription_: Subscription;
  private readonly endpoint_ = EndpointManager.resource(Resource.node);
  node: NodeDetail;
  isInitialized = false;
  podListEndpoint: string;
  eventListEndpoint: string;


  constructor(
    private readonly node_: ResourceService<NodeDetail>,
    private readonly actionbar_: ActionbarService,
    private readonly activatedRoute_: ActivatedRoute,
    private readonly notifications_: NotificationsService,
  ) {}
  ngOnInit(): void {
    const resourceName = "centaurus";
    this.podListEndpoint = this.endpoint_.child(resourceName, Resource.pod);
    this.eventListEndpoint = this.endpoint_.child(resourceName, Resource.event);
    this.nodeSubscription_ = this.node_
      .get(this.endpoint_.detail(), resourceName)
      .subscribe((d: NodeDetail) => {
        this.node = d;
        this.notifications_.pushErrors(d.errors);
        this.actionbar_.onInit.emit(new ResourceMeta('Node', d.objectMeta, d.typeMeta));
        this.isInitialized = true;
      });
  }

}











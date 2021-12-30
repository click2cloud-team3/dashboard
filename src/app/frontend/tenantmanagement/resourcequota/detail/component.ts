
import {Component, OnDestroy, OnInit,Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResourceQuotaDetail} from '@api/backendapi';
import {ActionbarService, ResourceMeta} from '../../../common/services/global/actionbar';
import {NotificationsService} from '../../../common/services/global/notifications';
import {EndpointManager, Resource} from 'common/services/resource/endpoint';
import {Subscription} from 'rxjs/Subscription';
import {NamespacedResourceService} from "../../../common/services/resource/resource";

@Component({
  selector: 'kd-resourcequotalist-detail',
  templateUrl: './template.html',
})
export class ResourceQuotaDetailComponent implements OnInit, OnDestroy {
  private resourcequotaSubscription_: Subscription;
  private readonly endpoint_ = EndpointManager.resource(Resource.resourcequota,false, false);
  resourcequota: ResourceQuotaDetail;
  isInitialized = false;

  constructor(
    private readonly resourcequota_: NamespacedResourceService<ResourceQuotaDetail>,
    private readonly actionbar_: ActionbarService,
    private readonly activatedRoute_: ActivatedRoute,
    private readonly notifications_: NotificationsService,
  ) {}

  ngOnInit(): void {
    const resourceName = this.activatedRoute_.snapshot.params.resourceName;
    const resourceNamespace = this.activatedRoute_.snapshot.params.resourceNamespace;
    alert(resourceNamespace);
    this.resourcequotaSubscription_ = this.resourcequota_
      .get(this.endpoint_.detail(), resourceName,resourceNamespace)
      .subscribe((d: ResourceQuotaDetail) => {
        this.resourcequota = d;
        this.notifications_.pushErrors(d.errors);
        this.actionbar_.onInit.emit(new ResourceMeta('Quota', d.objectMeta, d.typeMeta));
        this.isInitialized = true;
      });
  }
  ngOnDestroy(): void {
    this.resourcequotaSubscription_.unsubscribe();
    this.actionbar_.onDetailsLeave.emit();
  }
}


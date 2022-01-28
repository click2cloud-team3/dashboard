
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResourceQuotaDetail} from '@api/backendapi';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ActionbarService, ResourceMeta} from '../../../../common/services/global/actionbar';
import {NotificationsService} from '../../../../common/services/global/notifications';
import {EndpointManager, Resource} from '../../../../common/services/resource/endpoint';
import {NamespacedResourceService} from '../../../../common/services/resource/resource';

@Component({
  selector: 'kd-resourcequota-detail',
  templateUrl: './template.html',
})
export class ResourceQuotaDetailComponent implements OnInit, OnDestroy {
  private readonly endpoint_ = EndpointManager.resource(Resource.resourcequota, true,true);
  private readonly unsubscribe_ = new Subject<void>();

  resourcequota: ResourceQuotaDetail;
  isInitialized = false;

  constructor(
    private readonly resourcequota_: NamespacedResourceService<ResourceQuotaDetail>,
    private readonly actionbar_: ActionbarService,
    private readonly route_: ActivatedRoute,
    private readonly notifications_: NotificationsService
  ) {}


  ngOnInit(): void {
    const resourceName = this.route_.snapshot.params.resourceName;
    const resourceNamespace = this.route_.snapshot.params.resourceNamespace;

    this.resourcequota_
      .get(this.endpoint_.detail(), resourceName, resourceNamespace)
      .pipe(takeUntil(this.unsubscribe_))
      .subscribe((d: ResourceQuotaDetail) => {
        this.resourcequota = d;
        this.notifications_.pushErrors(d.errors);
        this.actionbar_.onInit.emit(new ResourceMeta('ResourceQuota', d.objectMeta, d.typeMeta));
        this.isInitialized = true;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe_.next();
    this.unsubscribe_.complete();
    this.actionbar_.onDetailsLeave.emit();
  }
}

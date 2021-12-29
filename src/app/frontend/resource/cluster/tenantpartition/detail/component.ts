// Copyright 2020 Authors of Arktos.

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
import { ComponentFactoryResolver, Input, OnDestroy} from '@angular/core';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Event, NodeDetail, Pod, PodList, TenantDetail} from '@api/backendapi';
import {Observable} from 'rxjs/Observable';
import {ActionbarService, ResourceMeta} from '../../../../common/services/global/actionbar';
import {NotificationsService} from '../../../../common/services/global/notifications';
import {NamespacedResourceService, ResourceService} from 'common/services/resource/resource';
import {EndpointManager, Resource} from 'common/services/resource/endpoint';
import {Subscription} from 'rxjs/Subscription';
import {GroupedResourceList} from "../../../../common/resources/groupedlist";
import {
  ListGroupIdentifier, ListIdentifier,

} from "../../../../common/components/resourcelist/groupids";
import {ResourceListWithStatuses} from "../../../../common/resources/list";
import {MenuComponent} from "../../../../common/components/list/column/menu/component";
import {ResourcesRatio} from "@api/frontendapi";

export const emptyResourcesRatio: ResourcesRatio = {
  cronJobRatio: [],
  daemonSetRatio: [],
  deploymentRatio: [],
  jobRatio: [],
  podRatio: [],
  replicaSetRatio: [],
  replicationControllerRatio: [],
  statefulSetRatio: [],
};

@Component({
  selector: 'kd-tenant-partition-detail',
  templateUrl: './template.html',
})
export class TenantPartitionDetailComponent implements OnInit, OnDestroy  {
  private tenantSubscription_: Subscription;
  private readonly endpoint_ = EndpointManager.resource(Resource.tenant);
  node: NodeDetail;
  tenant: TenantDetail;
  isInitialized = false;
  displayName: any = "";
  typeMeta: any = "";
  objectMeta: any = "";
  podListEndpoint:string;

  constructor(
    private readonly node_: ResourceService<NodeDetail>,
    private readonly tenant_: ResourceService<TenantDetail>,
    private readonly actionbar_: ActionbarService,
    private readonly activatedRoute_: ActivatedRoute,
    private readonly notifications_: NotificationsService,
  ) {}

  ngOnInit(): void {
    const resourceName = this.activatedRoute_.snapshot.params.resourceName;
    this.podListEndpoint = this.endpoint_.child(resourceName, Resource.pod);

    this.tenantSubscription_ = this.tenant_
      .get(this.endpoint_.detail(), resourceName)
      .subscribe((d: TenantDetail) => {
        this.tenant = d;
        this.notifications_.pushErrors(d.errors);
        this.actionbar_.onInit.emit(new ResourceMeta('Tenant', d.objectMeta, d.typeMeta));
        this.isInitialized = true;
      });
  }

  ngOnDestroy(): void {
    this.tenantSubscription_.unsubscribe();
    this.actionbar_.onDetailsLeave.emit();
  }
}


export class OverviewComponent extends GroupedResourceList {
  hasWorkloads(): boolean {
    return this.isGroupVisible(ListGroupIdentifier.workloads);
  }

  hasDiscovery(): boolean {
    return this.isGroupVisible(ListGroupIdentifier.discovery);
  }

  hasConfig(): boolean {
    return this.isGroupVisible(ListGroupIdentifier.config);
  }

  showWorkloadStatuses(): boolean {
    return (
      Object.values(this.resourcesRatio).reduce((sum, ratioItems) => sum + ratioItems.length, 0) !==
      0
    );
  }

  showGraphs(): boolean {
    return this.cumulativeMetrics.every(
      metrics => metrics.dataPoints && metrics.dataPoints.length > 1,
    );
  }
}

export class PodListComponent extends ResourceListWithStatuses<PodList, Pod> {
  @Input() endpoint = EndpointManager.resource(Resource.pod, true, true).list();

  constructor(
    private readonly podList: NamespacedResourceService<PodList>,
    resolver: ComponentFactoryResolver,
    notifications: NotificationsService,
  ) {
    super('pod', notifications, resolver);
    this.id = ListIdentifier.pod;
    this.groupId = ListGroupIdentifier.workloads;

    // Register status icon handlers
    this.registerBinding(this.icon.checkCircle, 'kd-success', this.isInSuccessState);
    this.registerBinding(this.icon.timelapse, 'kd-muted', this.isInPendingState);
    this.registerBinding(this.icon.error, 'kd-error', this.isInErrorState);

    // Register action columns.
    this.registerActionColumn<MenuComponent>('menu', MenuComponent);

    // Register dynamic columns.
    this.registerDynamicColumn('namespace', 'name', this.shouldShowNamespaceColumn_.bind(this));
  }

  getResourceObservable(params?: HttpParams): Observable<PodList> {
    return this.podList.get(this.endpoint, undefined, undefined, params);
  }

  map(podList: PodList): Pod[] {
    return podList.pods;
  }

  isInErrorState(resource: Pod): boolean {
    return resource.podStatus.status === 'Failed';
  }

  isInPendingState(resource: Pod): boolean {
    return resource.podStatus.status === 'Pending';
  }

  isInSuccessState(resource: Pod): boolean {
    return resource.podStatus.status === 'Succeeded' || resource.podStatus.status === 'Running';
  }

  protected getDisplayColumns(): string[] {
    return ['statusicon', 'name', 'labels', 'node', 'status', 'restarts', 'cpu', 'mem', 'age'];
  }
  protected getDisplayColumns2(): string[] {
    return ['statusicon', 'name', 'labels', 'node', 'status', 'restarts', 'cpu', 'mem', 'age'];
  }

  private shouldShowNamespaceColumn_(): boolean {
    return this.namespaceService_.areMultipleNamespacesSelected();
  }

  hasErrors(pod: Pod): boolean {
    return pod.warnings.length > 0;
  }

  getEvents(pod: Pod): Event[] {
    return pod.warnings;
  }

  getDisplayStatus(pod: Pod): string {
    // See kubectl printers.go for logic in kubectl:
    // https://github.com/kubernetes/kubernetes/blob/39857f486511bd8db81868185674e8b674b1aeb9/pkg/printers/internalversion/printers.go
    let msgState = 'running';
    let reason = undefined;

    // Init container statuses are currently not taken into account.
    // However, init containers with errors will still show as failed because of warnings.
    if (pod.podStatus.containerStates) {
      // Container states array may be null when no containers have started yet.
      for (let i = pod.podStatus.containerStates.length - 1; i >= 0; i--) {
        const state = pod.podStatus.containerStates[i];
        if (state.waiting) {
          msgState = 'waiting';
          reason = state.waiting.reason;
        }
        if (state.terminated) {
          msgState = 'terminated';
          reason = state.terminated.reason;
          if (!reason) {
            if (state.terminated.signal) {
              reason = `Signal:${state.terminated.signal}`;
            } else {
              reason = `ExitCode:${state.terminated.exitCode}`;
            }
          }
        }
      }
    }

    if (msgState === 'waiting') {
      return `Waiting: ${reason}`;
    }

    if (msgState === 'terminated') {
      return `Terminated: ${reason}`;
    }

    return pod.podStatus.podPhase;
  }
}

export class WorkloadStatusComponent {
  @Input() resourcesRatio: ResourcesRatio;
  colors: string[] = ['#00c752', '#f00', '#ffad20', '#006028'];

  constructor() {
    if (!this.resourcesRatio) {
      this.resourcesRatio = emptyResourcesRatio;
    }
  }
}

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
import {Observable} from 'rxjs/Observable';
import {ComponentFactoryResolver} from '@angular/core'
import {Component, OnDestroy, OnInit,Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  Deployment,
  DeploymentList,
  Event,
  Namespace,
  NamespaceList, Pod, PodList, ReplicaSet, ReplicaSetList,
  TenantDetail
} from '@api/backendapi';
import {ActionbarService, ResourceMeta} from '../../../../common/services/global/actionbar';
import {NotificationsService} from '../../../../common/services/global/notifications';
import {EndpointManager, Resource} from 'common/services/resource/endpoint';
import {Subscription} from 'rxjs/Subscription';
import {
  NamespacedResourceService,
  ResourceService
} from "../../../../common/services/resource/resource";
import {ResourceListWithStatuses} from "../../../../common/resources/list";
import {VerberService} from "../../../../common/services/global/verber";
import {
  ListGroupIdentifier,
  ListIdentifier
} from "../../../../common/components/resourcelist/groupids";
import {MenuComponent} from "../../../../common/components/list/column/menu/component";

@Component({
  selector: 'kd-tenant-detail',
  templateUrl: './template.html',
})
export class TenantDetailComponent implements OnInit, OnDestroy {
  private tenantSubscription_: Subscription;
  private readonly endpoint_ = EndpointManager.resource(Resource.tenant,false,false);
  tenant: TenantDetail;
  isInitialized = false;

  constructor(
    private readonly tenant_: NamespacedResourceService<TenantDetail>,
    private readonly actionbar_: ActionbarService,
    private readonly activatedRoute_: ActivatedRoute,
    private readonly notifications_: NotificationsService,
  ) {}

  ngOnInit(): void {
    console.log(this.activatedRoute_)
    const resourceName = this.activatedRoute_.snapshot.params.resourceName;
    const resourceNamespace = this.activatedRoute_.snapshot.params.resourceNamespace;
    this.tenantSubscription_ = this.tenant_
      .get(this.endpoint_.detail(), resourceName,resourceNamespace)
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
    return ['statusicon', 'name', 'labels', 'phase', 'age'];
  }
  //added the code
  onClick(): void {
    this.verber_.showNamespaceCreateDialog(this.displayName, this.typeMeta, this.objectMeta); //added showNamespaceCreateDialog
  }
}

export class DeploymentListComponent extends ResourceListWithStatuses<DeploymentList, Deployment> {
  @Input() endpoint = EndpointManager.resource(Resource.deployment, true, true).list();

  constructor(
    private readonly deployment_: NamespacedResourceService<DeploymentList>,
    notifications: NotificationsService,
    resolver: ComponentFactoryResolver,
  ) {
    super('deployment', notifications, resolver);
    this.id = ListIdentifier.deployment;
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

  getResourceObservable(params?: HttpParams): Observable<DeploymentList> {
    return this.deployment_.get(this.endpoint, undefined, undefined, params);
  }

  map(deploymentList: DeploymentList): Deployment[] {
    return deploymentList.deployments;
  }

  isInErrorState(resource: Deployment): boolean {
    return resource.pods.warnings.length > 0;
  }

  isInPendingState(resource: Deployment): boolean {
    return resource.pods.warnings.length === 0 && resource.pods.pending > 0;
  }

  isInSuccessState(resource: Deployment): boolean {
    return resource.pods.warnings.length === 0 && resource.pods.pending === 0;
  }

  getDisplayColumns(): string[] {
    return ['statusicon', 'name', 'labels', 'pods', 'age', 'images'];
  }

  getDisplayColumns2(): string[] {
    return ['statusicon', 'name', 'labels', 'phase', 'age'];
  }

  hasErrors(deployment: Deployment): boolean {
    return deployment.pods.warnings.length > 0;
  }

  getEvents(deployment: Deployment): Event[] {
    return deployment.pods.warnings;
  }

  private shouldShowNamespaceColumn_(): boolean {
    return this.namespaceService_.areMultipleNamespacesSelected();
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

  getDisplayColumns2(): string[] {
    return ['statusicon', 'name', 'labels', 'phase', 'age'];
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

export class ReplicaSetListComponent extends ResourceListWithStatuses<ReplicaSetList, ReplicaSet> {
  @Input() title: string;
  @Input() endpoint = EndpointManager.resource(Resource.replicaSet, true, true).list();

  constructor(
    private readonly replicaSet_: NamespacedResourceService<ReplicaSetList>,
    private readonly activatedRoute_: ActivatedRoute,
    notifications: NotificationsService,
    resolver: ComponentFactoryResolver,
  ) {
    super('replicaset', notifications, resolver);
    this.id = ListIdentifier.replicaSet;
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

  getResourceObservable(params?: HttpParams): Observable<ReplicaSetList> {
    return this.replicaSet_.get(this.endpoint, undefined, undefined, params);
  }

  map(rsList: ReplicaSetList): ReplicaSet[] {
    return rsList.replicaSets;
  }

  isInErrorState(resource: ReplicaSet): boolean {
    return resource.podInfo.warnings.length > 0;
  }

  isInPendingState(resource: ReplicaSet): boolean {
    return resource.podInfo.warnings.length === 0 && resource.podInfo.pending > 0;
  }

  isInSuccessState(resource: ReplicaSet): boolean {
    return resource.podInfo.warnings.length === 0 && resource.podInfo.pending === 0;
  }

  protected getDisplayColumns(): string[] {
    return ['statusicon', 'name', 'labels', 'pods', 'age', 'images'];
  }

  getDisplayColumns2(): string[] {
    return ['statusicon', 'name', 'labels', 'phase', 'age'];
  }

  private shouldShowNamespaceColumn_(): boolean {
    return this.namespaceService_.areMultipleNamespacesSelected();
  }

  hasErrors(replicaSet: ReplicaSet): boolean {
    return replicaSet.podInfo.warnings.length > 0;
  }

  getEvents(replicaSet: ReplicaSet): Event[] {
    return replicaSet.podInfo.warnings;
  }
}


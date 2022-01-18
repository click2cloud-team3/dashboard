// Copyright 2017 The Kubernetes Authors.
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
import {Node, NodeList} from '@api/backendapi';
import {Observable} from 'rxjs/Observable';
import {ResourceListWithStatuses} from '../../../resources/list';
import {NotificationsService} from '../../../services/global/notifications';
import {EndpointManager, Resource} from '../../../services/resource/endpoint';
import {ResourceService} from '../../../services/resource/resource';
import {MenuComponent} from '../../list/column/menu/component';
import {ListGroupIdentifier, ListIdentifier} from '../groupids';
import {VerberService} from "../../../services/global/verber";

@Component({
  selector: 'kd-partition-list',
  templateUrl: './template.html',
})
export class PartitionListComponent extends ResourceListWithStatuses<NodeList, Node> {
  @Input() endpoint = EndpointManager.resource(Resource.node).list();

  displayName:any;
  typeMeta:any;
  objectMeta:any;
  resourcePartitions: any;
  rpCount: number;
  tenantPartitions: any;
  tpCount: number;
  healthyRP: number;
  rpCpuRequestsFraction: number;
  rpMemoryLimitsFraction: number;
  tpCpuRequestsFraction: number;
  tpMemoryLimitsFraction: number;

  constructor(
    readonly verber_: VerberService,
    private readonly node_: ResourceService<NodeList>,
    notifications: NotificationsService,
  ) {
    super('node', notifications);
    this.id = ListIdentifier.node;
    this.groupId = ListGroupIdentifier.cluster;

    // Register action columns.
    this.registerActionColumn<MenuComponent>('menu', MenuComponent);

    // Register status icon handlers
    this.registerBinding(this.icon.checkCircle, 'kd-success', this.isInSuccessState);
    this.registerBinding(this.icon.help, 'kd-muted', this.isInUnknownState);
    this.registerBinding(this.icon.error, 'kd-error', this.isInErrorState);
  }

  getResourceObservable(params?: HttpParams): Observable<NodeList> {
    return this.node_.get(this.endpoint, undefined, params);
  }

  map(nodeList: NodeList): Node[] {
    const resourcePartitionList: any = [];
    const tenantPartitionList: any = [];
    let healthyRP = 0;
    let rpCpuRequestsFraction = 0;
    let rpMemoryLimitsFraction = 0;
    let tpCpuRequestsFraction = 0;
    let tpMemoryLimitsFraction = 0;

    nodeList.nodes.map((node)=>{
      if(node['objectMeta']['name'].includes("rp"))
      {
        resourcePartitionList.push(node);
        // @ts-ignore
        rpCpuRequestsFraction += node['allocatedResources']['cpuRequestsFraction'];
        // @ts-ignore
        rpMemoryLimitsFraction += node['allocatedResources']['memoryLimitsFraction'];
      }
      else{
        tenantPartitionList.push(node)
        // @ts-ignore
        tpCpuRequestsFraction += node['allocatedResources']['cpuRequestsFraction'];
        // @ts-ignore
        tpMemoryLimitsFraction += node['allocatedResources']['memoryLimitsFraction'];
      }
    })

    nodeList.nodes.map((node)=>{
      if(node['ready'] === 'True' && node['objectMeta']['name'].includes("rp") )
      {
        healthyRP += 1
      }
    })

    this.resourcePartitions = resourcePartitionList
    this.rpCount = resourcePartitionList.length
    this.tenantPartitions = tenantPartitionList
    this.tpCount = tenantPartitionList.length
    this.healthyRP = healthyRP
    this.rpCpuRequestsFraction = rpCpuRequestsFraction;
    this.rpMemoryLimitsFraction = rpMemoryLimitsFraction;
    this.tpCpuRequestsFraction = tpCpuRequestsFraction;
    this.tpMemoryLimitsFraction = tpMemoryLimitsFraction;
    return resourcePartitionList;
  }

  isTpHealthy(resource: Node): number {
    if (resource.ready === 'True') {
      return 1
    } else{
      return 0
    }
  }

  isInErrorState(resource: Node): boolean {
    return resource.ready === 'False';
  }

  isInUnknownState(resource: Node): boolean {
    return resource.ready === 'Unknown';
  }

  isInSuccessState(resource: Node): boolean {
    return resource.ready === 'True';
  }

  getDisplayColumns(): string[] {
    return ['statusicon', 'name', 'nodecount','cpulim','memlim','health','etcd'];
  }

  getDisplayColumns2(): string[] {
    return ['statusicon', 'name', 'nodecount','cpulim','memlim','tentcount','health','etcd'];
  }

  //added the code
  onClick(): void {
    this.verber_.showNodeCreateDialog(this.displayName, this.typeMeta, this.objectMeta); //added
  }
}

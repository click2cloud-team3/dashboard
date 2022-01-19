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
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'kd-node-list',
  templateUrl: './template.html',
})
export class NodeListComponent extends ResourceListWithStatuses<NodeList, Node> {
  @Input() endpoint = EndpointManager.resource(Resource.node).list();
  displayName:any;
  typeMeta:any;
  objectMeta:any;
  nodeCount: number;
  clusterName: string;
  partitions: [];

  constructor(
    readonly verber_: VerberService,
    private readonly node_: ResourceService<NodeList>,
    private readonly activatedRoute_: ActivatedRoute,
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

    this.activatedRoute_.queryParamMap.subscribe((paramMap => {
      this.clusterName = paramMap.get('clusterName')}))

  }

  getResourceObservable(params?: HttpParams): Observable<NodeList> {
    return this.node_.get(this.endpoint, undefined, params);
  }

  map(nodeList: NodeList): Node[] {

    const resourcePartitionList: any = [];
    const tenantPartitionList: any = [];

    nodeList.nodes.map((node)=>{
      if(node['objectMeta']['name'].includes("rp"))
      {
        resourcePartitionList.push(node);
      } else {
        tenantPartitionList.push(node);
      }
    })

    const resourcePartitions = resourcePartitionList.reduce((acc:any, item:any) => {
      acc[`${item.clusterName}`] = (acc[`${item.clusterName}`] || []);
      acc[`${item.clusterName}`].push(item);
      return acc;
    }, {});

    const tenantPartitions = tenantPartitionList.reduce((acc:any, item:any) => {
      acc[`${item.clusterName}`] = (acc[`${item.clusterName}`] || []);
      acc[`${item.clusterName}`].push(item);
      return acc;
    }, {});

    if (this.clusterName.includes("rp")){
      this.partitions = resourcePartitions[this.clusterName];
      this.nodeCount = resourcePartitions[this.clusterName].length
    }else{
      this.partitions = tenantPartitions[this.clusterName]
      this.nodeCount = tenantPartitions[this.clusterName].length

    }

    return this.partitions;
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
    return ['statusicon', 'name', 'labels', 'ready', 'cpureq', 'cpulim', 'memreq', 'memlim', 'age'];
  }

  getDisplayColumns2(): string[] {
    return ['statusicon', 'name', 'labels', 'ready', 'cpureq', 'cpulim', 'memreq', 'memlim', 'age'];
  }

  //added the code
  onClick(): void {
    this.verber_.showNodeCreateDialog(this.displayName, this.typeMeta, this.objectMeta); //added
  }
}

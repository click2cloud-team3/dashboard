
import {ResourceListWithStatuses} from "../../../common/resources/list";

import {EndpointManager, Resource} from "../../../common/services/resource/endpoint";
import {ResourceService} from "../../../common/services/resource/resource";
import {NotificationsService} from "../../../common/services/global/notifications";
import {
  ListGroupIdentifier,
  ListIdentifier
} from "../../../common/components/resourcelist/groupids";
import {MenuComponent} from "../../../common/components/list/column/menu/component";

import {HttpParams} from '@angular/common/http';
import {Component, Input} from '@angular/core';
import {Node, NodeList} from '@api/backendapi';
import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'kd-cluster-health-list-state',
  templateUrl: './template.html',
})

export class TenantMonitoringListComponent {

}


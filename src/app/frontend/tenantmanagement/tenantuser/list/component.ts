// Copyright 2020 Authors of Arktos.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Component,Input, OnInit} from '@angular/core';
import { MatTableDataSource} from '@angular/material';
import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ResourceListWithStatuses} from "../../../common/resources/list";
import {Tenant, TenantList} from "@api/backendapi";
import {EndpointManager, Resource} from "../../../common/services/resource/endpoint";
import {ResourceService} from "../../../common/services/resource/resource";
import {NotificationsService} from "../../../common/services/global/notifications";
import {
  ListGroupIdentifier,
  ListIdentifier
} from "../../../common/components/resourcelist/groupids";
import {MenuComponent} from "../../../common/components/list/column/menu/component";
import {TenantUsersDetailComponent} from "../detail/component";
export interface PeriodicElement {
  name: string;
  position: number;
  weight: string;
  symbol: string;
  selected?:boolean

}


const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'John', weight: 'Active', symbol: '18 hours'},
  {position: 2, name: 'Harry', weight: 'Active', symbol: '18 hours'},
  {position: 3, name: 'Jenkins', weight: 'Active', symbol: '18 hours'},

];
@Component({
  selector: 'kd-tenantusers-list',
  templateUrl: './template.html',
})
export class TenantUsersListComponent{


  displayedColumns: string[] =['select','position', 'name', 'weight', 'symbol'];

  dataSource = ELEMENT_DATA
  oneSelected=false;
  allSelected=false;

  change(element:PeriodicElement){
    let e= this.dataSource.find(item=>item.position===element.position);
    if(e){
      e.selected=true;
    }
    this.oneSelected=this.dataSource.filter(item=>item.selected).length>0
  }
  selectAll(){
    if(this.allSelected || !this.oneSelected){
      this.dataSource.forEach(item=>item.selected= false);
      this.allSelected=true;
    }else{
      this.dataSource.forEach(item=>item.selected= true);
      this.allSelected=false;
      this.oneSelected=false;
    }


  }
}






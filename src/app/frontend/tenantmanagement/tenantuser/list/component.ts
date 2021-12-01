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

import {Component,Input, OnInit,Inject} from '@angular/core';
import { HttpClient } from "@angular/common/http";
export interface Elements {

  User: string;
  Tenant: string;
  Phase: string;
  Age: string;
}
const ELEMENT_DATA: Elements[]=[];
@Component({
  selector: 'kd-tenantusers-list',
  templateUrl: './template.html',
})
export class TenantUsersListComponent implements OnInit{
  tempData:any[]=[];
  displayedColumns = ['User','Tenant','Phase','Age'];

  public userArray:any[] = [];
  dataSource:any;
  constructor(private http: HttpClient){
  }
  ngOnInit(): void {
    this.http.get('../assets/auth.csv', {responseType: 'text'})
      .subscribe(
        data => {
          let csvToRowArray = data.split("\n");
          for (let index = 1; index < csvToRowArray.length - 1; index++) {
            let row = csvToRowArray[index].split(",");
            this.userArray.push(row);
          }
          for(var i=0;i<this.userArray.length;i++)
          {
            ELEMENT_DATA.push({User:this.userArray[i][1],Tenant:this.userArray[i][4],Phase:this.userArray[i][5],Age:this.userArray[i][6]});
          }
          this.dataSource=ELEMENT_DATA
          console.log(ELEMENT_DATA)
        },
        error => {
          console.log(error);
        }
      );
  }

}

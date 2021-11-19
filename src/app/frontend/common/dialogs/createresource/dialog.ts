// Copyright 2020 Authors of Arktos - file modified.
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



import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import  {TenantService} from "../../services/global/tenant";
import {NamespaceService} from "../../services/global/namespace";
import {AppDeploymentContentSpec} from "@api/backendapi";

@Component({
  selector: 'kd-delete-resource-dialog',
  templateUrl: 'template.html',
})



export class CreateResourceDialog {
  tenant_name: string;
  // namespace_name: string;

  constructor(public dialog: MatDialog,
              private http:HttpClient,
              private readonly namespace_: NamespaceService,
              private readonly tenant_: TenantService,) {}

  openDialog() {
    const dialogRef = this.dialog.open(CreateResourceDialog);
    var data = {
      tenant_name: "this.tenant_name",
      // namespace_name: "this.namespace_name"
    }

     this.http.post<any>('https://192.168.1.244:9445/api/v1/tenant', data);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      console.log(data);
    });
  }
}


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

import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

export interface PeriodicElement {
  name: any;
  fingerpring: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Admin', fingerpring: 'bb:5f:bc:78:f1:a0:7f:09:8b:Oe:d6:69:6d:b1:b2:3a' },
  { name: 'test key pair', fingerpring: 'bb:5f:bc:78:f1:a0:7f:09:8b:Oe:d6:69:6d:b1:b2:3a' },
  { name: 'test key pair', fingerpring: 'bb:5f:bc:78:f1:a0:7f:09:8b:Oe:d6:69:6d:b1:b2:3a' },
  { name: 'test key pair2', fingerpring: 'bb:5f:bc:78:f1:a0:7f:09:8b:Oe:d6:69:6d:b1:b2:3a' },
  { name: 'test key pair', fingerpring: 'bb:5f:bc:78:f1:a0:7f:09:8b:Oe:d6:69:6d:b1:b2:3a' },
  { name: 'test key pair4', fingerpring: 'bb:5f:bc:78:f1:a0:7f:09:8b:Oe:d6:69:6d:b1:b2:3a' },
  { name: 'test key pair', fingerpring: 'bb:5f:bc:78:f1:a0:7f:09:8b:Oe:d6:69:6d:b1:b2:3a' },
  { name: 'test key pair5', fingerpring: 'bb:5f:bc:78:f1:a0:7f:09:8b:Oe:d6:69:6d:b1:b2:3a' },
  { name: 'test key pair', fingerpring: 'bb:5f:bc:78:f1:a0:7f:09:8b:Oe:d6:69:6d:b1:b2:3a' },
  { name: 'test key pair7', fingerpring: 'bb:5f:bc:78:f1:a0:7f:09:8b:Oe:d6:69:6d:b1:b2:3a' },
];

@Component({
  selector: 'kd-instance-list',
  templateUrl: './template.html',
})

export class KeypairListComponent {

  panelOpenState = false;
  displayedColumns: string[] = ['select', 'name', 'fingerpring', 'action'];
  // dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}


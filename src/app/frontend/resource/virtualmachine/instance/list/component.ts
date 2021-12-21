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

import {Component, ViewChild, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

export interface PeriodicElement {
  name: any;
  image: any;
  ip: any;
  flavor: any;
  keypair: any;
  status: string;
  zone: string;
  task: string;
  state: string;
  time: any;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Instance1', image: 'DND-centos7', ip: '192.168.199.3', flavor: 'm1.small', keypair: 'openstac-test-keypair', status: 'Active', zone: 'nova', task: 'none', state: 'Running', time: '1 week, 5 days'},
  {name: 'Instance2', image: 'DND-centos7', ip: '192.168.199.3', flavor: 'm1.tiny', keypair: 'openstac-test-keypair', status: 'Error', zone: 'nova', task: 'none', state: 'No State', time: '2 week, 5 days'},
  {name: 'Instance3', image: 'DND-centos7', ip: '192.168.199.3', flavor: 'm1.small', keypair: 'openstac-test-keypair', status: 'Active', zone: 'nova', task: 'none', state: 'Running', time: '3 week, 5 days'},
  {name: 'Instance4', image: 'DND-centos7', ip: '192.168.199.3', flavor: 'm1.medium', keypair: 'openstac-test-keypair', status: 'Shutoff', zone: 'nova', task: 'none', state: 'Shut down', time: '1 week, 5 days'},
  {name: 'Instance5', image: 'DND-centos7', ip: '192.168.199.3', flavor: 'm1.large', keypair: 'openstac-test-keypair', status: 'Active', zone: 'nova', task: 'none', state: 'Running', time: '2 week, 5 days'},
  {name: 'Instance6', image: 'DND-centos7', ip: '192.168.199.3', flavor: 'm1.large', keypair: 'openstac-test-keypair', status: 'Active', zone: 'nova', task: 'none', state: 'Running', time: '2 week, 5 days'},
  {name: 'Instance7', image: 'DND-centos7', ip: '192.168.199.3', flavor: 'm1.large', keypair: 'openstac-test-keypair', status: 'Active', zone: 'nova', task: 'none', state: 'Running', time: '2 week, 5 days'},
  {name: 'Instance8', image: 'DND-centos7', ip: '192.168.199.3', flavor: 'm1.large', keypair: 'openstac-test-keypair', status: 'Active', zone: 'nova', task: 'none', state: 'Running', time: '2 week, 5 days'},
  {name: 'Instance9', image: 'DND-centos7', ip: '192.168.199.3', flavor: 'm1.large', keypair: 'openstac-test-keypair', status: 'Active', zone: 'nova', task: 'none', state: 'Running', time: '2 week, 5 days'},
  {name: 'Instance10', image: 'DND-centos7', ip: '192.168.199.3', flavor: 'm1.large', keypair: 'openstac-test-keypair', status: 'Active', zone: 'nova', task: 'none', state: 'Running', time: '2 week, 5 days'},
  {name: 'Instance11', image: 'DND-centos7', ip: '192.168.199.3', flavor: 'm1.large', keypair: 'openstac-test-keypair', status: 'Active', zone: 'nova', task: 'none', state: 'Running', time: '2 week, 5 days'},
  {name: 'Instance12', image: 'DND-centos7', ip: '192.168.199.3', flavor: 'm1.large', keypair: 'openstac-test-keypair', status: 'Active', zone: 'nova', task: 'none', state: 'Running', time: '2 week, 5 days'},
];

@Component({
  selector: 'kd-instance-list',
  templateUrl: './template.html',
})

export class InstanceListComponent implements  OnInit{

  panelOpenState = false;
  displayedColumns: string[] = ['select', 'name', 'image', 'ip', 'flavor', 'keypair', 'status', 'zone', 'task', 'state', 'time', 'action'];
  // dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource(ELEMENT_DATA);  

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}


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

import {Component} from '@angular/core';

interface PeriodicElement {
  owner: string;
  name: any;
  type: any;
  status: string;
  visiblity: string;
  protected: string;
  diskformat: string;
  size: any;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {owner: 'admin', name: 'DND-centos7', type: 'Active', status: 'Active', visiblity: 'Private', protected: 'No', diskformat: 'QCOW2', size: '331.38 MB'},
  {owner: 'admin', name: 'DND-centos7', type: 'Active', status: 'Error', visiblity: 'Public', protected: 'No', diskformat: 'QCOW2', size: '331.38 MB'},
  {owner: 'admin', name: 'DND-centos7', type: 'Active', status: 'Active', visiblity: 'Private', protected: 'No', diskformat: 'QCOW2', size: '331.38 MB'},
  {owner: 'admin', name: 'DND-centos7', type: 'Active', status: 'Shutoff', visiblity: 'Shared', protected: 'No', diskformat: 'QCOW2', size: '331.38 MB'},
  {owner: 'admin', name: 'DND-centos7', type: 'Active', status: 'Active', visiblity: 'Private', protected: 'No', diskformat: 'QCOW2', size: '331.38 MB'},
  {owner: 'admin', name: 'DND-centos7', type: 'Active', status: 'Active', visiblity: 'Public', protected: 'No', diskformat: 'QCOW2', size: '331.38 MB'},
];

@Component({
  selector: 'kd-instance-list',
  templateUrl: './template.html',
})

export class ImageListComponent {

  panelOpenState = false;
  displayedColumns: string[] = ['select', 'owner', 'name', 'type', 'status', 'visiblity', 'protected', 'diskformat', 'size', 'action'];
  dataSource = ELEMENT_DATA;
}


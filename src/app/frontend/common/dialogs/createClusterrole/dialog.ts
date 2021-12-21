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

import {Component,Inject,OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AbstractControl, Validators,FormBuilder} from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import {CONFIG} from "../../../index.config";
import {CsrfTokenService} from "../../services/global/csrftoken";
import {AlertDialog, AlertDialogConfig} from "../alert/dialog";

export interface CreateClusterroleDialogMeta {
  name: string;
  apiGroups: string []
  resources: string[]
  verbs: string[]
}

@Component({
  selector: 'kd-create-clusterrole-dialog',
  templateUrl: 'template.html',
})

export class CreateClusterroleDialog implements OnInit {
  form1: FormGroup;

  private readonly config_ = CONFIG;

  ClusterroleMaxLength = 63;
  ClusterrolePattern: RegExp = new RegExp('^[a-z0-9]([-a-z0-9]*[a-z0-9])?$');

  name: string
  apigroup: string[]
  resource: string[]
  verb : string[]

  constructor(
    public dialogRef: MatDialogRef<CreateClusterroleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CreateClusterroleDialogMeta,
    private readonly http_: HttpClient,
    private readonly csrfToken_: CsrfTokenService,
    private readonly matDialog_: MatDialog,
    private readonly fb_: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form1 = this.fb_.group({
      clusterrole: [
        '',
        Validators.compose([
          Validators.maxLength(this.ClusterroleMaxLength),
          Validators.pattern(this.ClusterrolePattern),
        ]),
      ],
      apigroups: [
        '',
        Validators.compose([
          Validators.maxLength(this.ClusterroleMaxLength),
        ]),
      ],
      resources: [
        '',
        Validators.compose([
          Validators.maxLength(this.ClusterroleMaxLength),
        ]),
      ],
      verbs: [
        '',
        Validators.compose([
          Validators.maxLength(this.ClusterroleMaxLength),
        ]),
      ],
    });
  }

  get clusterrole(): AbstractControl {
    return this.form1.get('clusterrole');
  }
  get apigroups(): AbstractControl {
    return this.form1.get('apigroups');
  }
  get verbs(): AbstractControl {
    return this.form1.get('verbs');
  }
  get resources(): AbstractControl {
    return this.form1.get('resources');
  }
  // function for creating new Clusterrole
  createclusterrole(): void {
    if (!this.form1.valid) return;
    this.apigroup = this.apigroups.value.split(',')
    this.resource = this.resources.value.split(',')
    this.verb = this.verbs.value.split(',')
    const clusterroleSpec= {name: this.clusterrole.value,apiGroups: this.apigroup,verbs: this.verb,resources: this.resource};
    const tokenPromise = this.csrfToken_.getTokenForAction('clusterrole');
    console.log(clusterroleSpec)
    tokenPromise.subscribe(csrfToken => {
      return this.http_
        .post<{valid: boolean}>(
          'api/v1/clusterrole',
          {...clusterroleSpec},
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          () => {
            this.dialogRef.close(this.clusterrole.value);
            this.dialogRef.close();
            const configData: AlertDialogConfig = {
              title: 'Successfull',
              message: "Clusterrole created",
              confirmLabel: 'CREATED',
            };
            this.matDialog_.open(AlertDialog, {data: configData});
          },
          error => {
            this.dialogRef.close();
            const configData: AlertDialogConfig = {
              title: 'Error creating Clusterrole',
              message: error.data,
              confirmLabel: 'OK',
            };
            this.matDialog_.open(AlertDialog, {data: configData});
          },
        );
    });
  }

  isDisabled(): boolean {
    return this.data.name.indexOf(this.clusterrole.value) >= 0;
  }
  cancel(): void {
    this.dialogRef.close();
  }
}

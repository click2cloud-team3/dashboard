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



import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AbstractControl, Validators,FormBuilder,FormArray} from '@angular/forms';
import { FormGroup } from '@angular/forms';
import {CONFIG} from "../../../index.config";
import {CsrfTokenService} from "../../services/global/csrftoken";
import {AlertDialog, AlertDialogConfig} from "../alert/dialog";


export interface assignQuotaDialogMeta {
  tenants: string[];
  StorageClusterId: string []
  data : string[]
}
@Component({
  selector: 'kd-assign-quota-dialog',
  templateUrl: 'template.html',
})

export class assignQuotaDialog implements OnInit {
  form1: FormGroup;

  private readonly config_ = CONFIG;

  /**
   * Max-length validation rule for ns
   */
  tenantMaxLength = 63;
  storageidMaxLength =10;
  /**
   * Pattern validation rule for namespace
   */
  tenantPattern: RegExp = new RegExp('^[a-z0-9]([-a-z0-9]*[a-z0-9])?$');
  storageidPattern: RegExp = new RegExp('^[0-9]$');


  constructor(
    public dialogRef: MatDialogRef<assignQuotaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: assignQuotaDialogMeta,
    private readonly http_: HttpClient,
    private readonly csrfToken_: CsrfTokenService,
    private readonly matDialog_: MatDialog,
    private readonly fb_: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form1 = this.fb_.group({
      users: this.fb_.array([
        this.fb_.group({
          formselect: [''],
          forminput: ['']
        })
      ])
    })

  }
  removeFormControl(i: number) {
    let usersArray = this.form1.get('users') as FormArray;
    usersArray.removeAt(i);
  }

  addFormControl() {
    let usersArray = this.form1.get('users') as FormArray;
    let arraylen = usersArray.length;

    let newUsergroup: FormGroup = this.fb_.group({
      formselect: [''],
      forminput: ['']
    })

    usersArray.insert(arraylen, newUsergroup);
  }

  get userFormGroups (){
    return this.form1.get('users') as FormArray
  }

  onSubmit(){
    console.log(this.form1.value);
  }

  get tenant(): AbstractControl {
    return this.form1.get('tenant');
  }
  /**
   * Creates new tenant based on the state of the controller.
   */
  createQuota(): void {
    if (!this.form1.valid) return;
    const tenantSpec= {name: this.tenant.value,StorageClusterId: this.tenant.value};
    const tokenPromise = this.csrfToken_.getTokenForAction('tenant');
    tokenPromise.subscribe(csrfToken => {
      return this.http_
        .post<{valid: boolean}>(
          'api/v1/tenant',
          {...tenantSpec},
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          () => {
            // this.log_.info('Successfully created namespace:', savedConfig);
            this.dialogRef.close(this.tenant.value);
          },
          error => {
            // this.log_.info('Error creating namespace:', err);
            this.dialogRef.close();
            const configData: AlertDialogConfig = {
              title: 'Error creating tenant',
              message: error.data,
              confirmLabel: 'OK',
            };
            this.matDialog_.open(AlertDialog, {data: configData});
          },
        );
    });
  }
  /**
   * Returns true if new namespace name hasn't been filled by the user, i.e, is empty.
   */
  isDisabled(): boolean {
    return this.data.tenants.indexOf(this.tenant.value) >= 0;
  }

  /**
   * Cancels the new namespace form.
   */
  cancel(): void {
    this.dialogRef.close();
  }
  showContent1(){
    document.getElementById("first_tab_content").style.display = "block";
    document.getElementById("second_tab_content").style.display = "none";
  }
  showContent2(){
    document.getElementById("first_tab_content").style.display = "none";
    document.getElementById("second_tab_content").style.display = "block";
  }
}





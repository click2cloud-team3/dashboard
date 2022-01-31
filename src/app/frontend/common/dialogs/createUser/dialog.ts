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



import {Component, OnInit, Inject,NgZone} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AbstractControl, Validators,FormBuilder} from '@angular/forms';

import {FormGroup} from '@angular/forms';
import {CONFIG} from "../../../index.config";
import {CsrfTokenService} from "../../services/global/csrftoken";
import {AlertDialog, AlertDialogConfig} from "../alert/dialog";

import {NamespacedResourceService} from '../../services/resource/resource';
import {TenantService} from "../../services/global/tenant";
import {SecretDetail,Role,RoleList} from '../../../typings/backendapi';
import {validateUniqueName} from "../../../create/from/form/validator/uniquename.validator";


export interface UserToken {
  token: string;
}

export interface CreateUserDialogMeta {
  tenants: string;
  storageclusterid: string;
}
@Component({
  selector: 'kd-create-tenant-dialog',
  templateUrl: 'template.html',
})

export class CreateUserDialog implements OnInit {
  form1: FormGroup;
  tenants: string[];
  secrets: string[];
  roles:string[];
  namespaceUsed = "default"
  adminroleUsed = "admin-role";
  apiGroups : string [] =["", "extensions", "apps","rbac.authorization.k8s.io"]
  resources : string [] =["*"]
  verbs :string []= ["*"]
  serviceAccountCreated:any[] = [];
  secretDetails:any[] = [];
  selected = '';
  Usertype='';

  private readonly config_ = CONFIG
  tenantMaxLength = 24;
  storageidMaxLength =24;
  tenantPattern: RegExp = new RegExp('^[a-z0-9]([-a-z0-9]*[a-z0-9])?$');
  storageidPattern: RegExp = new RegExp('^[0-9]$');

  secret: SecretDetail;
  secretName =""

  private tenant_: string;

  constructor(
    private readonly secret_: NamespacedResourceService<SecretDetail>,
    public dialogRef: MatDialogRef<CreateUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CreateUserDialogMeta,
    private readonly http_: HttpClient,
    private readonly csrfToken_: CsrfTokenService,
    private readonly matDialog_: MatDialog,
    private readonly fb_: FormBuilder,
    private readonly tenantService_ : TenantService,
    private readonly dialog_: MatDialog,
    private readonly route_: ActivatedRoute,
    private readonly ngZone_: NgZone,
  ) {}

  ngOnInit(): void {
    this.form1 = this.fb_.group({
        role: [this.route_.snapshot.params.role || '', Validators.required],
        usertype: [
          '',
          Validators.compose([
            Validators.maxLength(this.tenantMaxLength),
            Validators.pattern(this.tenantPattern),
          ]),
        ],
        tenant: [
          '',
          Validators.compose([
            Validators.maxLength(this.tenantMaxLength),
            Validators.pattern(this.tenantPattern),
          ]),
        ],

        username: [
          '',
          Validators.compose([
            Validators.maxLength(this.tenantMaxLength),
            Validators.pattern(this.tenantPattern),
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.maxLength(this.tenantMaxLength),
            Validators.pattern(this.tenantPattern),
          ]),
        ],
        storageclusterid :[
          '',
          Validators.compose([
            Validators.maxLength(this.storageidMaxLength),
            Validators.pattern(this.storageidPattern),
          ]),
        ],

      },
    );
    this.role.valueChanges.subscribe((role: string) => {
      this.name.clearAsyncValidators();
      this.name.setAsyncValidators(validateUniqueName(this.http_, role));
      this.name.updateValueAndValidity();
    });
    this.http_.get('api/v1/role').subscribe((result: RoleList) => {
      this.roles = result.items.map((role: Role) => role.objectMeta.name);
      this.role.patchValue(
        !this.tenantService_.isCurrentSystem()
          ? this.route_.snapshot.params.role || this.roles[0]
          : this.roles[0],
      );
    });

    this.ngZone_.run(() => {
      const usertype = sessionStorage.getItem('userType');
      this.Usertype=usertype
    });


  }

  selectUserType(event:any)
  {
    this.selected=event;
  }
  get name(): AbstractControl {
    return this.form1.get('name');
  }
  get imagePullSecret(): AbstractControl {
    return this.form1.get('imagePullSecret');
  }
  resetImagePullSecret(): void {
    this.imagePullSecret.patchValue('');
  }
  get tenant(): any {
    return this.tenantService_.current()
  }
  get role(): AbstractControl {
    return this.form1.get('role');
  }
  get user(): AbstractControl {
    return this.form1.get('username');
  }
  get pass(): AbstractControl {
    return this.form1.get('password');
  }

  get usertype(): AbstractControl {
    return this.form1.get('usertype');
  }

  get storageclusterid(): AbstractControl {
    return this.form1.get('storageclusterid');
  }
  get namespace(): AbstractControl {
    return this.form1.get('namespace');
  }

  createUser() {

    const currentType = sessionStorage.getItem('userType')

    if (this.usertype.value === 'tenant-admin' && currentType === 'cluster-admin') {
      this.tenant_ = this.user.value
    } else if (this.usertype.value === 'tenant-admin' && currentType === 'tenant-admin') {
      this.tenant_ = this.tenant
    } else if (this.usertype.value === 'tenant-user') {
      this.tenant_ = this.tenant
    } else {
      this.tenant_ = 'system'
    }

    this.getToken(async (token_:any)=>{

      const userSpec= {username: this.user.value, password:this.pass.value, token:token_, type:this.usertype.value,tenant:this.tenant_};

      const userTokenPromise = await this.csrfToken_.getTokenForAction('users');
      userTokenPromise.subscribe(csrfToken => {
        return this.http_
          .post<{valid: boolean}>(
            'api/v1/users',
            {...userSpec},
            {
              headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
            },
          )
          .subscribe(
            () => {
              this.dialogRef.close(this.user.value);
            },

          );
      });
    })

  }

  // create role
  createRole(): void {
    const roleSpec= {name: this.user.value, namespace: this.namespaceUsed, apiGroups: this.apiGroups,verbs: this.verbs,resources: this.resources};
    const tokenPromise = this.csrfToken_.getTokenForAction('role');
    tokenPromise.subscribe(csrfToken => {
      return this.http_
        .post<{valid: boolean}>(
          'api/v1/role',
          {...roleSpec},
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          () => {
            this.dialogRef.close(this.user.value);
          },
          error => {
            this.dialogRef.close();
            const configData: AlertDialogConfig = {
              title: 'Error creating Role',
              message: error.data,
              confirmLabel: 'OK',
            };
            this.matDialog_.open(AlertDialog, {data: configData});
          },
        );
    });
  }

  // create clusterrole
  createClusterRole(): void {
    const clusterRoleSpec = {name:this.user.value, apiGroups:this.apiGroups, verbs:this.verbs, resources:this.resources};
    const tokenPromise = this.csrfToken_.getTokenForAction('clusterrole');
    tokenPromise.subscribe(csrfToken => {
      return this.http_
        .post<{valid: boolean}>(
          'api/v1/clusterrole',
          {...clusterRoleSpec},
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          () => {
            this.dialogRef.close(this.user.value);
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

  // create service account
  createServiceAccount() {
    if(this.Usertype == "tenant-admin") {
      this.namespaceUsed = "default"
    }
    const serviceAccountSpec= {name: this.user.value,namespace: this.namespaceUsed};
    const tokenPromise = this.csrfToken_.getTokenForAction('serviceaccount');
    tokenPromise.subscribe(csrfToken => {
      return this.http_
        .post<{valid: boolean}>(
          'api/v1/serviceaccount',
          {...serviceAccountSpec},
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          (data) => {
            this.dialogRef.close(this.user.value);
            this.serviceAccountCreated.push(Object.entries(data))
          },
        );
    })
  }

  createRoleBinding(): void{
    if(this.usertype.value == "tenant-user") {
      this.namespaceUsed = "default"
    }
    const roleBindingsSpec= {name: this.user.value,namespace: this.namespaceUsed, subject: { kind: "ServiceAccount", name: this.user.value,  namespace : this.namespaceUsed, apiGroup : ""},role_ref:{kind: "Role",name: this.role.value,apiGroup: "rbac.authorization.k8s.io"}};
    const tokenPromise = this.csrfToken_.getTokenForAction('rolebindings');
    tokenPromise.subscribe(csrfToken => {
      return this.http_
        .post<{valid: boolean}>(
          'api/v1/rolebindings',
          {...roleBindingsSpec},
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          () => {
            this.dialogRef.close(this.user.value);
          },
        );
    })

  }
  //  Creates new tenant based on the state of the controller.
  createTenant(): void {
    const tenantSpec= {name: this.user.value,storageclusterid: this.storageclusterid.value};
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
            this.dialogRef.close(this.tenant.value);
          },
          error => {
            this.dialogRef.close();
            const configData: AlertDialogConfig = {
              title: 'Tenant Already Exists',
              message: error.data,
              confirmLabel: 'OK',
            };
            this.matDialog_.open(AlertDialog, {data: configData});
          },
        );
    });
  }
  createClusterRoleBinding(): void{
    if( this.usertype.value == "tenant-admin")
    {
      this.adminroleUsed = this.user.value
    }
    const crbSpec= {name: this.user.value,namespace: this.namespaceUsed, subject: { kind: "ServiceAccount", name: this.user.value,  namespace : this.namespaceUsed, apiGroup : ""},role_ref:{kind: "ClusterRole",name: this.adminroleUsed,apiGroup: "rbac.authorization.k8s.io"}};
    const tokenPromise = this.csrfToken_.getTokenForAction('clusterrolebindings');
    tokenPromise.subscribe(csrfToken => {
      return this.http_
        .post<{valid: boolean}>(
          'api/v1/clusterrolebindings',
          {...crbSpec},
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          () => {
            this.dialogRef.close(this.user.value);
          },
        );
    })

  }
  //to decode token
  decode(s: string): string {
    return atob(s);
  }
  // Get Secret name
  getToken(callback: any): any {
    let interval = setInterval(() => {
      this.http_.get("api/v1/secret/"+ this.namespaceUsed ).subscribe((data:any)=>{
        data.secrets.map((elem: any) => {
          if(elem.objectMeta.name.includes(this.user.value + '-token')){
            clearInterval(interval);
            this.http_.get("api/v1/secret/" + this.namespaceUsed + "/" + elem.objectMeta.name).subscribe((data: any) => {
              callback(this.decode(data.data.token));
            })
          }
        });
      });
    }, 3000);


  }
  createTenantUser() {
    this.createServiceAccount()
    if(this.usertype.value == "tenant-user"){
      this.createTenant()
      this.createRoleBinding()

    } else {
      if(this.usertype.value == "cluster-admin") {
        this.adminroleUsed = "admin-role"
      }
      else{
        this.createTenant()
        this.createClusterRole()
      }
      this.createClusterRoleBinding()
    }
    this.createUser()
  }

  isCreateDisabled(): boolean {
    return !this.user.value || !this.pass.value || !this.usertype.value;
  }
  /**
   * Returns true if new tenant name hasn't been filled by the user, i.e, is empty.
   */
  isDisabled(): boolean {
    return this.data.tenants.indexOf(this.tenant.value) >= 0;
  }

  /**
   * Cancels the new tenant form.
   */
  cancel(): void {
    this.dialogRef.close();
  }
}

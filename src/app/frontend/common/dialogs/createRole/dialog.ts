
import {Component, OnInit, Inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AbstractControl, Validators,FormBuilder} from '@angular/forms';
import {FormGroup} from '@angular/forms';
import {CONFIG} from "../../../index.config";
import {CsrfTokenService} from "../../services/global/csrftoken";
import {AlertDialog, AlertDialogConfig} from "../alert/dialog";
import {NamespacedResourceService} from "../../services/resource/resource";
import {TenantDetail} from "@api/backendapi";

export interface CreateRoleDialogMeta {
  name: string;
  apiGroups: string []
  resources: string[]
  verbs: string[]
  namespace: string[]
}
@Component({
  selector: 'kd-create-role-dialog',
  templateUrl: 'template.html',
})

export class CreateRoleDialog implements OnInit {
  form1: FormGroup;
  private readonly config_ = CONFIG;

  //Validation
  roleMaxLength = 24;
  rolePattern: RegExp = new RegExp('^[a-z0-9]([-a-z0-9]*[a-z0-9])?$');

  namespaceMaxLength = 63;
  namespacePattern: RegExp = new RegExp('^[a-z0-9]([-a-z0-9]*[a-z0-9])?$');

  apiGroupsMaxLength = 63;
  apiGroupsPattern: RegExp = new RegExp('^[a-z\\a-z\\d_@.#$=!%^)(\\]:\\*;\\?\\/\\,}{\'\\|<>\\[&\\+-]*$');

  resourceMaxLength = 63;
  resourcePattern: RegExp = new RegExp('^^[a-z\\a-z\\d_@.#$=!%^)(\\]:\\*;\\?\\/\\,}{\'\\|<>\\[&\\+-]*$');

  verbsMaxLength = 63;
  verbsPattern: RegExp = new RegExp('^^[a-z\\a-z\\d_@.#$=!%^)(\\]:\\*;\\?\\/\\,}{\'\\|<>\\[&\\+-]*$');

  apiGroups1: string[]
  resources1: string[]
  verbs1: string[]

  currentTenant: string

  constructor(
    public dialogRef: MatDialogRef<CreateRoleDialog>,
    private readonly tenant_: NamespacedResourceService<TenantDetail>,
    @Inject(MAT_DIALOG_DATA) public data: CreateRoleDialogMeta,
    private readonly http_: HttpClient,
    private readonly csrfToken_: CsrfTokenService,
    private readonly matDialog_: MatDialog,
    private readonly fb_: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.currentTenant = this.tenant_['tenant_']['currentTenant_']
    this.form1 = this.fb_.group({
      role: [
        '',
        Validators.compose([

          Validators.maxLength(this.roleMaxLength),
          Validators.pattern(this.rolePattern),
        ]),
      ],
      apigroups: [
        '',
        Validators.compose([
          Validators.maxLength(this.apiGroupsMaxLength),
          Validators.pattern(this.apiGroupsPattern),
        ]),
      ],
      namespace: [
        '',
        Validators.compose([
          Validators.maxLength(this.namespaceMaxLength),
          Validators.pattern(this.namespacePattern),
        ]),
      ],
      resources: [
        '',
        Validators.compose([
          Validators.maxLength(this.resourceMaxLength),
          Validators.pattern(this.resourcePattern),
        ]),
      ],
      verbs: [
        '',
        Validators.compose([
          Validators.maxLength(this.verbsMaxLength),
          Validators.pattern(this.verbsPattern),
        ]),
      ],
    });
  }

  get role(): AbstractControl {
    return this.form1.get('role');
  }
  get namespace(): AbstractControl {
    return this.form1.get('namespace');
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

  createrole(): void {
    if (!this.form1.valid) return;
    this.apiGroups1 = this.apigroups.value.split(',')
    this.resources1 = this.resources.value.split(',')
    this.verbs1 = this.verbs.value.split(',')

    const tenantRoleSpec = {name: this.role.value, namespace: this.namespace.value, apiGroups: this.apiGroups1,verbs: this.verbs1,resources: this.resources1};
    const tenantTokenPromise = this.csrfToken_.getTokenForAction('role');
    tenantTokenPromise.subscribe(csrfToken => {
      return this.http_
        .post<{valid: boolean}>(
          'api/v1/role',
          {...tenantRoleSpec},
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          () => {
            this.dialogRef.close(this.role.value);
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

    const roleSpec = {name: this.role.value, tenant: this.currentTenant, namespace: this.namespace.value, apiGroups: this.apiGroups1,verbs: this.verbs1,resources: this.resources1};
    const tokenPromise = this.csrfToken_.getTokenForAction('roles');
    tokenPromise.subscribe(csrfToken => {
      return this.http_
        .post<{valid: boolean}>(
          'api/v1/roles',
          {...roleSpec},
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          () => {
            this.dialogRef.close(this.role.value);
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

  isDisabled(): boolean {
    return this.data.name.indexOf(this.role.value) >= 0;
  }
  cancel(): void {
    this.dialogRef.close();
  }
}

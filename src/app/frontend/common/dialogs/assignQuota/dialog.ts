
import {Component,Inject,OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AbstractControl, Validators,FormBuilder} from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import {CONFIG} from "../../../index.config";
import {CsrfTokenService} from "../../services/global/csrftoken";
import {AlertDialog, AlertDialogConfig} from "../alert/dialog";

export interface assignQuotaDialogMeta {
  quotanames: string[];
  tenants: string[];
  namespaces: string[];
  service: string[];
  memory: string[];
  cpus: string[];
  pods: string[];
  pvc: string[];
  config_maps: string[];
  secrets: string[];
  ephemeral_storage: string[];
}

@Component({
  selector: 'kd-assign-quota-dialog',
  templateUrl: 'template.html',
})

export class assignQuotaDialog implements OnInit {
  form1: FormGroup;

  private readonly config_ = CONFIG;
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
      quotaname: '',
      tenant: '',
      namespace: '',
      service: '',
      memory: '',
      cpu: '',
      pod: '',
      pvc: '',
      config_maps: '',
      secrets: '',
      ephemeral_storage: '',

    });
  }

  get quotanames(): AbstractControl {
    return this.form1.get('quotaname');
  }
  get tenants(): AbstractControl {
    return this.form1.get('tenant');
  }
  get namespaces(): AbstractControl {
    return this.form1.get('namespace');
  }
  get service(): AbstractControl {
    return this.form1.get('service');
  }

  get memory(): AbstractControl {
    return this.form1.get('memory');
  }
  get cpus(): AbstractControl {
    return this.form1.get('cpu');
  }
  get pods(): AbstractControl {
    return this.form1.get('pod');
  }
  get pvc(): AbstractControl {
    return this.form1.get('pvc');
  }
get config_maps(): AbstractControl {
    return this.form1.get('config_maps');
  }
  get secrets(): AbstractControl {
    return this.form1.get('secrets');
  }
  get ephemeral_storage(): AbstractControl {
    return this.form1.get('ephemeral_storage');
  }

  // function for creating new Clusterrole
  createQuota(): void {
   // alert(this.storage.value)
    if (!this.form1.valid) return;
    const quotaSpec= {
      name: this.quotanames.value ,
      tenant: this.tenants.value,
      name_space: this.namespaces.value,
      cpu: this.cpus.value,
      memory: this.memory.value,
      pods: this.pods.value,
      services: this.service.value,
      pvc: this.pvc.value,
      config_maps: this.config_maps.value,
      secrets: this.secrets.value,
      // storage: this.storage.value,
      ephemeral_storage: this.ephemeral_storage.value,
    };
    const tokenPromise = this.csrfToken_.getTokenForAction('resourcequota');
    tokenPromise.subscribe(csrfToken => {
      return this.http_
        .post<{valid: boolean}>(
          'api/v1/resourcequota',
          {...quotaSpec},
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          () => {
            this.dialogRef.close(this.quotanames.value);
            this.dialogRef.close();
            const configData: AlertDialogConfig = {
              title: 'Successful',
              message: "Quota created",
              confirmLabel: 'CREATED',
            };
            this.matDialog_.open(AlertDialog, {data: configData});
          },
          error => {
            this.dialogRef.close();
            const configData: AlertDialogConfig = {
              title: 'Error creating Quota',
              message: error.data,
              confirmLabel: 'OK',
            };
            this.matDialog_.open(AlertDialog, {data: configData});
          },
        );
    });
  }



  isDisabled(): boolean {
    return this.data.quotanames.indexOf(this.quotanames.value) >= 0;
  }
  cancel(): void {
    this.dialogRef.close();
  }

}

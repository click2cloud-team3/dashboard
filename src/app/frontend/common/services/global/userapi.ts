import { Injectable } from '@angular/core'
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CsrfTokenService} from "./csrftoken";
import {CONFIG} from "../../../index.config";

export interface DashboardUser {
  id:number;
  username: string;
  password: string;
  token: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})

export class UserApi {

  private readonly config_ = CONFIG;

  constructor(
    private http:HttpClient,
    private readonly csrfToken_: CsrfTokenService,
  ){}

  allUsers()
  {
    return this.http.get<DashboardUser[]>("/api/v1/users")
  }

  deleteUser(userID:string) {
    let url="/api/v1/users/"+userID
    return this.http.delete(url)
  }

  deleteTenant(tenantname:string) {
    let url="/api/v1/tenants/"+tenantname
    const tokenPromise = this.csrfToken_.getTokenForAction('tenants');
    tokenPromise.subscribe(csrfToken => {
      return this.http
        .delete<{valid: boolean}>(
          url,
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          (data) => {
            console.log("deleted "+data)
          },
        );
    })
  }

  //delete Service Account
  deleteServiceAccount(sa_name:string) {
    let sa_url="/api/v1/namespaces/default/serviceaccounts/"+sa_name;
    const tokenPromise = this.csrfToken_.getTokenForAction('serviceaccounts');
    tokenPromise.subscribe(csrfToken => {
      return this.http
        .delete<{valid: boolean}>(
          sa_url,
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          (data) => {
            console.log("Service Account deleted "+data)
          },
        );
    })
  }

  //delete Role
  deleteRole(role_name:string) {
    let sa_url="/api/v1/namespaces/default/role/"+role_name;
    const tokenPromise = this.csrfToken_.getTokenForAction('role');
    tokenPromise.subscribe(csrfToken => {
      return this.http
        .delete<{valid: boolean}>(
          sa_url,
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          (data) => {
            console.log("Role deleted "+data)
          },
        );
    })
  }

  // delete RoleBinding ** NOT in API handler
  deleteRoleBinding(rolebinding_name:string) {
    let sa_url="/api/v1/namespaces/default/rolebinding/"+rolebinding_name;
    const tokenPromise = this.csrfToken_.getTokenForAction('rolebinding');
    tokenPromise.subscribe(csrfToken => {
      return this.http
        .delete<{valid: boolean}>(
          sa_url,
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          (data) => {
            console.log("Role deleted "+data)
          },
        );
    })
  }

  //delete ClusterRole ** NOT in API handler
  deleteClusterRole(clusterrole_name:string) {
    let sa_url="/api/v1/namespaces/default/clusterrole/"+clusterrole_name;
    const tokenPromise = this.csrfToken_.getTokenForAction('clusterrole');
    tokenPromise.subscribe(csrfToken => {
      return this.http
        .delete<{valid: boolean}>(
          sa_url,
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          (data) => {
            console.log("Role deleted "+data)
          },
        );
    })
  }

  //delete ClusterRole ** NOT in API handler
  deleteClusterRoleBinding(clusterrolebinding_name:string) {
    let sa_url="/api/v1/namespaces/default/clusterrolebinding/"+clusterrolebinding_name;
    const tokenPromise = this.csrfToken_.getTokenForAction('clusterrolebinding');
    tokenPromise.subscribe(csrfToken => {
      return this.http
        .delete<{valid: boolean}>(
          sa_url,
          {
            headers: new HttpHeaders().set(this.config_.csrfHeaderName, csrfToken.token),
          },
        )
        .subscribe(
          (data) => {
            console.log("Role deleted "+data)
          },
        );
    })
  }

  // Call this methoed on delete button click **When delete apis created
  deleteResources(id:string, resourcename:string, user_type:string) {
    this.deleteServiceAccount(resourcename)
    if(user_type=="TenantUser")
    {
      this.deleteRole(resourcename)
      this.deleteRoleBinding(resourcename)
    }
    else{
      this.deleteClusterRole(resourcename)
      this.deleteClusterRoleBinding(resourcename)
    }

    //call deleteUser fun now
    console.log("user id to be deleted"+id)
  }
}

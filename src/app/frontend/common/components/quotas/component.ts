
import {Component, Input, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MatTableDataSource, MatSelect} from '@angular/material';
import {ResourceQuotaDetail} from 'typings/backendapi';

import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil, startWith, switchMap} from 'rxjs/operators';

import {TenantList} from '@api/backendapi';
import {TENANT_STATE_PARAM, NAMESPACE_STATE_PARAM} from '../../params/params';
import {TenantService} from '../../services/global/tenant';
import {ResourceService} from 'common/services/resource/resource';
import {EndpointManager, Resource} from 'common/services/resource/endpoint';
import {NotificationsService, NotificationSeverity} from 'common/services/global/notifications';
import {CONFIG} from 'index.config';

@Component({
  selector: 'kd-resource-quota-list',
  templateUrl: './template.html',
  styleUrls: ['style.scss'],
})
export class ResourceQuotaListComponent {
  @Input() initialized: boolean;
  @Input() quotas: ResourceQuotaDetail[];

  private tenantUpdate_ = new Subject();
  private unsubscribe_ = new Subject();
  private readonly endpoint_ = EndpointManager.resource(Resource.tenant);

  tenants: string[] = [];
  selectedTenant: string;
  resourceNameParam: string;
  selectTenantInput = '';
  systemTenantName = CONFIG.systemTenantName;

  @ViewChild(MatSelect, {static: true}) private readonly select_: MatSelect;
  @ViewChild('tenantInput', {static: true}) private readonly tenantInputEl_: ElementRef;

  constructor(
    private readonly router_: Router,
    private readonly tenantService_: TenantService,
    private readonly tenant_: ResourceService<TenantList>,
    private readonly notifications_: NotificationsService,
    private readonly _activeRoute: ActivatedRoute,
  ) {}


  ngOnInit(): void {
    this._activeRoute.queryParams.pipe(takeUntil(this.unsubscribe_)).subscribe(params => {
      const tenant = params.tenant;
      //tenantlist loaded at ngoninit and get tenant[1] added
      this.tenantUpdate_
        .pipe(takeUntil(this.unsubscribe_))
        .pipe(startWith({}))
        .pipe(switchMap(() => this.tenant_.get(this.endpoint_.list())))
        .subscribe(
          tenantList => {
            this.tenants = tenantList.tenants
              .map(t => t.objectMeta.name)
              .filter(t => t !== this.systemTenantName);

            var tenantslist= tenantList.tenants;//added
            var selectedtenantname=tenantslist[1].objectMeta.name;//added
            const tenantselected =selectedtenantname;

            //on pageload get name of tenant from tenantlist using index[1] on tenant dropdown
            this.selectedTenant = selectedtenantname;
            if (tenantList.errors.length > 0) {
              for (const err of tenantList.errors) {
                this.notifications_.push(err.ErrStatus.message, NotificationSeverity.error);
              }
            }
          },
          () => {},
          () => {
            this.onTenantLoaded_();
          },
        );

      if (!tenant) {
        this.setDefaultQueryParams_();
        return;
      }

      if (this.tenantService_.current() === tenant) {
        return;
      }

      this.tenantService_.setCurrent(tenant);
      this.router_.navigate([this._activeRoute.snapshot.url], {
        queryParams: {
          [TENANT_STATE_PARAM]:  this.selectedTenant,
        },
        queryParamsHandling: 'merge',
      });
    });

    this.select_.value = this.selectTenant;
  }


  ngOnDestroy(): void {
    this.unsubscribe_.next();
    this.unsubscribe_.complete();
  }

  selectTenant(): void {
    this.changeTenant_(this.selectedTenant);
  }

  onTenantToggle(opened: boolean): void {
    if (opened) {
      this.tenantUpdate_.next();
      this.focusTenantInput_();
    } else {
      this.changeTenant_(this.selectedTenant);
    }
  }


  /**
   * When state is loaded and tenants are fetched, perform basic validation.
   */
  private onTenantLoaded_(): void {
    let newTenant = this.tenantService_.getAuthTenant();
    const targetTenant = this.selectedTenant;
    console.log(newTenant)

    if (
      targetTenant &&
      (this.tenants.indexOf(targetTenant) >= 0 || this.tenantService_.isTenantValid(targetTenant))
    ) {
      newTenant = targetTenant;
    }

    if (newTenant !== this.selectedTenant) {
      this.changeTenant_(newTenant);
    }
  }

  /**
   * Focuses tenant input field after clicking on tenant selector menu.
   */
  private focusTenantInput_(): void {
    // Wrap in a timeout to make sure that element is rendered before looking for it.
    setTimeout(() => {
      this.tenantInputEl_.nativeElement.focus();
    }, 150);
  }

  private clearTenantInput_(): void {
    this.selectTenantInput = '';
  }

  private changeTenant_(tenant: string): void {
    this.clearTenantInput_();

    this.router_.navigate(['overview'], {
      queryParams: {
        [TENANT_STATE_PARAM]: tenant,
        [NAMESPACE_STATE_PARAM]: '',
      },
      queryParamsHandling: 'merge',
    });
  }

  setDefaultQueryParams_( ): void {
    this.router_.navigate([this._activeRoute.snapshot.url], {
      queryParams: {
        [TENANT_STATE_PARAM]: 'tenant-1',
      },
      queryParamsHandling: 'merge',
    });
  }


  getQuotaColumns(): string[] {
    return ['name', 'age', 'status'];
  }

  getDataSource(): MatTableDataSource<ResourceQuotaDetail> {
    const tableData = new MatTableDataSource<ResourceQuotaDetail>();
    tableData.data = this.quotas;
    return tableData;
  }
}








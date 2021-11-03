import {NgModule} from '@angular/core';

import {ComponentsModule} from '../../common/components/module';
import {SharedModule} from '../../shared.module';


// import {ActionbarComponent} from '../product/actionbar/component';
import {TenantQuotaDetailComponent} from 'tenantmanagement/tenantquota/detail/component';
import {TenantQuotaListComponent} from 'tenantmanagement/tenantquota/list/component';

import {TenantQuotasRoutingModule} from './routing';


@NgModule({
  imports: [SharedModule, ComponentsModule, TenantQuotasRoutingModule],
  declarations: [TenantQuotaDetailComponent,TenantQuotaListComponent],
})
export class TenantQuotasModule {}

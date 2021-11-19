import {NgModule} from '@angular/core';

import {ComponentsModule} from '../../../common/components/module';
import {SharedModule} from '../../../shared.module';


// import {ActionbarComponent} from '../product/actionbar/component';
import {TenantMonitoringListComponent} from 'tenantmanagement/tenantmonitoring/list/component';

import {TenantMonitoringListRoutingModule} from './routing';

@NgModule({
  imports: [SharedModule, ComponentsModule, TenantMonitoringListRoutingModule],
  declarations: [TenantMonitoringListComponent],
})
export class TenantMonitoringListModule {}

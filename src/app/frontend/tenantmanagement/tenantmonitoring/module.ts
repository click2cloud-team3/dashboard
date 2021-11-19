import {NgModule} from '@angular/core';

import {ComponentsModule} from '../../common/components/module';
import {SharedModule} from '../../shared.module';


// import {ActionbarComponent} from '../product/actionbar/component';
import {TenantMonitoringComponent} from 'tenantmanagement/tenantmonitoring/component';

import {TenantMonitoringRoutingModule} from './routing';


@NgModule({
  imports: [SharedModule, ComponentsModule, TenantMonitoringRoutingModule],
  declarations: [TenantMonitoringComponent],
})
export class TenantMonitoringModule {}

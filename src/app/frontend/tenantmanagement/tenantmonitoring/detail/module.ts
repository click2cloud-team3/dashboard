import {NgModule} from '@angular/core';

import {ComponentsModule} from '../../../common/components/module';
import {SharedModule} from '../../../shared.module';


// import {ActionbarComponent} from '../product/actionbar/component';
import {TenantMonitoringDetailComponent} from 'tenantmanagement/tenantmonitoring/detail/component';

import {TenantMonitoringDetailRoutingModule} from './routing';

@NgModule({
  imports: [SharedModule, ComponentsModule, TenantMonitoringDetailRoutingModule],
  declarations: [TenantMonitoringDetailComponent],
})
export class ClusterHealthDetailModule {}

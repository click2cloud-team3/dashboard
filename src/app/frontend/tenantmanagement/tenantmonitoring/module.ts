
import {NgModule} from '@angular/core';

import {ComponentsModule} from '../../common/components/module';
import {SharedModule} from '../../shared.module';

import {TenantMonitoringDetailComponent} from './detail/component';
import {TenantMonitoringListComponent} from './list/component';
import {TenantMonitoringRoutingModule} from './routing';

@NgModule({
  imports: [SharedModule, ComponentsModule, TenantMonitoringRoutingModule],
  declarations: [TenantMonitoringListComponent, TenantMonitoringDetailComponent],
})
export class TenantMonitoringModule {}

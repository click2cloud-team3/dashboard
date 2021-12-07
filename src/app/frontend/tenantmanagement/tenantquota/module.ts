
import {NgModule} from '@angular/core';

import {ComponentsModule} from '../../common/components/module';
import {SharedModule} from '../../shared.module';

import {TenantQuotaDetailComponent} from './detail/component';
import {TenantQuotaListComponent} from './list/component';
import {TenantQuotaRoutingModule} from './routing';

@NgModule({
  imports: [SharedModule, ComponentsModule, TenantQuotaRoutingModule],
  declarations: [TenantQuotaListComponent, TenantQuotaDetailComponent],
})
export class TenantQuotaModule {}

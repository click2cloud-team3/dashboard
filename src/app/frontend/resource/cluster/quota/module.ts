
import {NgModule} from '@angular/core';

import {ComponentsModule} from '../../../common/components/module';
import {SharedModule} from '../../../shared.module';
import {QuotaDetailComponent} from './detail/component';
import {QuotaListComponent} from './list/component';
import {QuotaRoutingModule} from './routing';

@NgModule({
  imports: [SharedModule, ComponentsModule, QuotaRoutingModule],
  declarations: [QuotaListComponent, QuotaDetailComponent],
})
export class QuotaModule {}

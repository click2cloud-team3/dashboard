import {NgModule} from '@angular/core';

import {ComponentsModule} from '../../../common/components/module';
import {SharedModule} from '../../../shared.module';


// import {ActionbarComponent} from '../product/actionbar/component';
import {UserMonitoringDetailComponent} from 'usermanagement/usermonitoring/detail/component';

import {UserMonitoringDetailRoutingModule} from './routing';

@NgModule({
  imports: [SharedModule, ComponentsModule, UserMonitoringDetailRoutingModule],
  declarations: [UserMonitoringDetailComponent],
})
export class UserDetailModule {}

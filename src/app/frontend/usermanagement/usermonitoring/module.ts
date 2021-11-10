import {NgModule} from '@angular/core';

import {ComponentsModule} from '../../common/components/module';
import {SharedModule} from '../../shared.module';


// import {ActionbarComponent} from '../product/actionbar/component';
import {UserMonitoringComponent} from 'usermanagement/usermonitoring/component';

import {UserMonitoringRoutingModule} from './routing';


@NgModule({
  imports: [SharedModule, ComponentsModule, UserMonitoringRoutingModule],
  declarations: [UserMonitoringComponent],
})
export class UserMonitoringModule {}

import {NgModule} from '@angular/core';

import {ComponentsModule} from '../../../common/components/module';
import {SharedModule} from '../../../shared.module';


// import {ActionbarComponent} from '../product/actionbar/component';
import {UserMonitoringListComponent} from 'usermanagement/usermonitoring/list/component';

import {UserMonitoringListRoutingModule} from './routing';

@NgModule({
  imports: [SharedModule, ComponentsModule, UserMonitoringListRoutingModule],
  declarations: [UserMonitoringListComponent],
})
export class UserMonitoringListModule {}

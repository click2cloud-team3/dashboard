import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { NodeDetail } from '@api/backendapi';
import {Subscription} from 'rxjs/Subscription';

import {ActionbarService, ResourceMeta} from '../../../common/services/global/actionbar';
import {NotificationsService} from '../../../common/services/global/notifications';
import {EndpointManager, Resource} from '../../../common/services/resource/endpoint';
import {ResourceService} from '../../../common/services/resource/resource';

@Component({
  selector: 'kd-tenantmonitoring-detail',
  template: '',

})
export class TenantMonitoringDetailComponent  {


}

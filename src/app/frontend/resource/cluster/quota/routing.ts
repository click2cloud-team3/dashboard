
import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {DEFAULT_ACTIONBAR} from '../../../common/components/actionbars/routing';

import {CLUSTER_ROUTE} from '../routing';

import {QuotaDetailComponent} from './detail/component';
import {QuotaListComponent} from './list/component';

const QUOTA_LIST_ROUTE: Route = {
  path: '',
  component: QuotaListComponent,
  data: {
    breadcrumb: 'Quotas',
    parent: CLUSTER_ROUTE,
  },
};

const QUOTA_DETAIL_ROUTE: Route = {
  path: ':resourceName',
  component: QuotaDetailComponent,
  data: {
    breadcrumb: '{{ resourceName }}',
    parent: QUOTA_LIST_ROUTE,
  },
};

@NgModule({
  imports: [RouterModule.forChild([QUOTA_LIST_ROUTE, QUOTA_DETAIL_ROUTE, DEFAULT_ACTIONBAR])],
  exports: [RouterModule],
})
export class QuotaRoutingModule {}

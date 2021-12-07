
import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {DEFAULT_ACTIONBAR} from '../../common/components/actionbars/routing';

import {TENANTMANAGEMENT_ROUTE} from '../routing';

import {TenantQuotaDetailComponent} from './detail/component';
import {TenantQuotaListComponent} from './list/component';

const QUOTA_LIST_ROUTE: Route = {
  path: '',
  component: TenantQuotaListComponent,
  data: {
    breadcrumb: 'Quotas',
    parent: TENANTMANAGEMENT_ROUTE,
  },
};

const QUOTA_DETAIL_ROUTE: Route = {
  path: ':resourceName',
  component: TenantQuotaDetailComponent,
  data: {
    breadcrumb: '{{ resourceName }}',
    parent: QUOTA_LIST_ROUTE,
  },
};

@NgModule({
  imports: [RouterModule.forChild([QUOTA_LIST_ROUTE, QUOTA_DETAIL_ROUTE, DEFAULT_ACTIONBAR])],
  exports: [RouterModule],
})
export class TenantQuotaRoutingModule {}

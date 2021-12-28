import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {DEFAULT_ACTIONBAR} from '../../../common/components/actionbars/routing';

import {CLUSTER_ROUTE} from '../routing';

import {PartitionDetailComponent} from './detail/component';
import {PartitionListComponent} from './list/component';

const PARTITION_LIST_ROUTE: Route = {
  path: '',
  component: PartitionListComponent,
  data: {
    breadcrumb: 'Partition',
    parent: CLUSTER_ROUTE,
  },
};

const PARTITION_DETAIL_ROUTE: Route = {
  path: ':resourceName',
  component: PartitionDetailComponent,
  data: {
    breadcrumb: '{{ resourceName }}',
    parent: PARTITION_LIST_ROUTE,
  },
};

@NgModule({
  imports: [RouterModule.forChild([PARTITION_LIST_ROUTE, PARTITION_DETAIL_ROUTE, DEFAULT_ACTIONBAR])],
  exports: [RouterModule],
})
export class PartitionRoutingModule {}

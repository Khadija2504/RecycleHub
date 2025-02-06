import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionRequestComponent } from './collection-request/collection-request.component';
import { CollectionsListComponent } from './collections-list/collections-list.component';
import { EditCollectionComponent } from './edit-collection/edit-collection.component';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { AuthGuard } from '../auth/auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { PendingRequestsListComponent } from './pending-requests-list/pending-requests-list.component';

const routes: Routes = [
  {path: 'collection-request', component: CollectionRequestComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Individual' }
  },
  {path: 'collections-list', component: CollectionsListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Individual' }
  },
  {path: 'edit-collection/:id', component: EditCollectionComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Individual' }
  },
  {path: 'requests-list', component: RequestsListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Collector' }
  },
  {path: 'pending-requests', component: PendingRequestsListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {role: 'Collector'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionRequestComponent } from './collection-request/collection-request.component';
import { CollectionsListComponent } from './collections-list/collections-list.component';

const routes: Routes = [
  {path: 'collection-request', component: CollectionRequestComponent},
  {path: 'collections-list', component: CollectionsListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionRoutingModule { }

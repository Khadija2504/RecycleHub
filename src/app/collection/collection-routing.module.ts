import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionRequestComponent } from './collection-request/collection-request.component';
import { CollectionsListComponent } from './collections-list/collections-list.component';
import { EditCollectionComponent } from './edit-collection/edit-collection.component';

const routes: Routes = [
  {path: 'collection-request', component: CollectionRequestComponent},
  {path: 'collections-list', component: CollectionsListComponent},
  {path: 'edit-collection/:id', component: EditCollectionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionRoutingModule { }

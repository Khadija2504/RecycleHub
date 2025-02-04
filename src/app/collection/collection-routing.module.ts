import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionRequestComponent } from './collection-request/collection-request.component';

const routes: Routes = [
  {path: 'collection-request', component: CollectionRequestComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectionRoutingModule { }

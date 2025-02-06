import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectionRoutingModule } from './collection-routing.module';
import { CollectionRequestComponent } from './collection-request/collection-request.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CollectionsListComponent } from './collections-list/collections-list.component';
import { EditCollectionComponent } from './edit-collection/edit-collection.component';


@NgModule({
  declarations: [
    CollectionRequestComponent,
    CollectionsListComponent,
    EditCollectionComponent
  ],
  imports: [
    CommonModule,
    CollectionRoutingModule,
    ReactiveFormsModule
  ]
})
export class CollectionModule { }

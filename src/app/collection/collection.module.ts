import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectionRoutingModule } from './collection-routing.module';
import { CollectionRequestComponent } from './collection-request/collection-request.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CollectionsListComponent } from './collections-list/collections-list.component';
import { EditCollectionComponent } from './edit-collection/edit-collection.component';
import { RequestsListComponent } from './requests-list/requests-list.component';
import { PendingRequestsListComponent } from './pending-requests-list/pending-requests-list.component';


@NgModule({
  declarations: [
    CollectionRequestComponent,
    CollectionsListComponent,
    EditCollectionComponent,
    RequestsListComponent,
    PendingRequestsListComponent
  ],
  imports: [
    CommonModule,
    CollectionRoutingModule,
    ReactiveFormsModule
  ]
})
export class CollectionModule { }

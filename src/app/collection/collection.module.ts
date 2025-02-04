import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectionRoutingModule } from './collection-routing.module';
import { CollectionRequestComponent } from './collection-request/collection-request.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CollectionRequestComponent
  ],
  imports: [
    CommonModule,
    CollectionRoutingModule,
    ReactiveFormsModule
  ]
})
export class CollectionModule { }

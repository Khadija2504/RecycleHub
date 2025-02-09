import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VoucherConversionComponent } from './voucher-conversion/voucher-conversion.component';


@NgModule({
  declarations: [
    UserDetailsComponent,
    UpdateProfileComponent,
    VoucherConversionComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ProfileModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { VoucherConversionComponent } from './voucher-conversion/voucher-conversion.component';

const routes: Routes = [
  {path: '', component: UserDetailsComponent},
  {path: 'update-profile', component: UpdateProfileComponent},
  { path: 'voucher-conversion', component: VoucherConversionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }

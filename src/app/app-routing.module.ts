import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnauthorizeComponent } from './unauthorize/unauthorize.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Individual' }},
  {path: 'collection', loadChildren: () => import('./collection/collection.module').then(m => m.CollectionModule)},
  { path: '', redirectTo: '/auth', pathMatch: 'full' }, 
  { path: '**', component: UnauthorizeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

    if (user && user.role) {
      const requiredRole = route.data['role'];
      if (user.role === requiredRole) {
        return true;
      }
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}

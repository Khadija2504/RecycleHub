import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  userRole: string | null = null;
  userPoints: number = 0;
  private userSub!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSub = this.authService.getCurrentUserObservable().subscribe(user => {
      this.isLoggedIn = !!user;
      this.userRole = user?.role;
      this.userPoints = user?.points || 0;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  hasRole(role: string): boolean {
    return this.authService.getUserRole() === role;
  }

  logout(): void {
    this.authService.logout();
    setTimeout(()=> this.router.navigate(['/auth/login']));
  }
}

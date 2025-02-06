import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoggedIn: boolean = false;
  userRole: string | null = null;

  constructor(private authService: AuthService, private router:Router) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userRole = this.authService.getUserRole();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  hasRole(role: string): boolean {
    console.log(role);
    console.log(this.authService.getUserRole());
    return this.authService.getUserRole() === role;
  }

  logout(): void {
    this.authService.logout();
    setTimeout(()=> this.router.navigate(['/auth/login']));
  }
}

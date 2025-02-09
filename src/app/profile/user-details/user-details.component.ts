import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone:  false,
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  user: any;

  constructor(private profileService: ProfileService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.profileService.getCurrentUser();
  }

  deleteAccount(email: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement votre compte?')) {
      this.profileService.deleteUserProfile(email);
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    }
  }

  hasRole(role: string): boolean {
    return this.authService.getUserRole() === role;
  }
}

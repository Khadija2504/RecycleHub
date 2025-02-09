import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone:  false,
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  user: any;

  constructor(private profileService: ProfileService, private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.profileService.getCurrentUser();
  }

  hasRole(role: string): boolean {
    return this.authService.getUserRole() === role;
  }
}

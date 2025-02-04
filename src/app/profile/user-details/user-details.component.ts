import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile',
  standalone:  false,
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  user: any;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.user = this.profileService.getCurrentUser();
  }
}

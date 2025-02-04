import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-update-profile',
  standalone: false,
  
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.css'
})

export class UpdateProfileComponent implements OnInit {
  profileForm!: FormGroup;
  errorMessage: string = '';
  profilePhotoUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.profileService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }
  
    this.profileForm = this.fb.group({
      firstName: [user.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [user.lastName, [Validators.required, Validators.minLength(2)]],
      email: [{ value: user.email, disabled: true }, [Validators.required, Validators.email]],
      phone: [user.phone, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [user.address],
      birthDate: [user.birthDate, Validators.required],
      profilePhoto: [''],
      role: [{ value: user.role, disabled: true }]
    });
  
    this.profilePhotoUrl = user.profilePhoto || '';
  }
  

  updateProfile() {
    if (this.profileForm.invalid) {
      this.errorMessage = "Please fill out all required fields.";
      return;
    }

    const updatedData = this.profileForm.getRawValue();
    this.profileService.updateUser(updatedData);
    alert("Profile updated successfully!");
    this.router.navigate(['/profile']);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePhotoUrl = e.target.result;
        this.profileForm.controls['profilePhoto'].setValue(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  get formControls() {
    return this.profileForm.controls;
  }
}

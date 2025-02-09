import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';
  profilePhotoUrl: string = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [''],
      birthDate: ['', Validators.required],
      profilePhoto: [''],
      role: ['Individual'],
    });
  }

  register() {
    if (this.registerForm.invalid) {
      this.errorMessage = "Please fill in all required fields.";
      return;
    }
  
    const formData = this.registerForm.value;
  
    if (this.authService.emailExists(formData.email)) {
      this.errorMessage = "This email is already in use.";
      return;
    }
  
    const profilePhotoFile = this.registerForm.get('profilePhoto')?.value;
    if (profilePhotoFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        const userData = {
          ...formData,
          profilePhoto: base64Image
        };
  
        this.authService.registerUser(userData);
        this.registerForm.reset();
        this.errorMessage = "";
        alert("Registration successful!");
        this.router.navigate(['/auth/login']);
      };
      reader.readAsDataURL(profilePhotoFile);
    } else {
      this.authService.registerUser(formData);
      this.registerForm.reset();
      this.errorMessage = "";
      alert("Registration successful!");
      this.router.navigate(['/auth/login']);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePhotoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      this.registerForm.get('profilePhoto')?.setValue(file);
    }
  }

  get formControls() {
    return this.registerForm.controls;
  }
}

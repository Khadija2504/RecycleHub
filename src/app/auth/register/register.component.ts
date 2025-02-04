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
      profilePhoto: ['']
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

    this.authService.registerUser(formData);

    this.registerForm.reset();
    this.errorMessage = "";
    alert("Registration successful!");
    this.router.navigate(['/login']);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePhotoUrl = e.target.result;  
      };
      reader.readAsDataURL(file);
      this.registerForm.controls['profilePhoto'].setValue(file);
    }
  }

  get formControls() {
    return this.registerForm.controls;
  }
}

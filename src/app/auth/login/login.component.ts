import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.errorMessage = "Please enter a valid email and password.";
      return;
    }

    const { email, password } = this.loginForm.value;
    const users = this.authService.getUsers();

    users.subscribe(userList => {
      const user = userList.find(u => u.email === email && u.password === password);
      
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert("Login successful!");
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = "Invalid email or password.";
      }
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }
}

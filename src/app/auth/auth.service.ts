import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usersKey = 'users';
  private currentUser = 'currentUser';
  private staticUsers = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'collector1@example.com',
      password: 'password123',
      phone: '0123456789',
      address: 'casablanca',
      birthDate: '1990-01-01',
      profilePhoto: 'url-to-photo',
      role: 'Collector'
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'collector2@example.com',
      password: 'password456',
      phone: '0987654321',
      address: 'safi',
      birthDate: '1985-05-10',
      profilePhoto: 'url-to-photo',
      role: 'Collector'
    }
  ];
  private usersSubject = new BehaviorSubject<any[]>(this.loadUsers());
  users$ = this.usersSubject.asObservable();

  constructor() {
    if (this.loadUsers().length === 0) {
      this.saveUsers(this.staticUsers);
    }
  }

  private loadUsers(): any[] {
    const data = localStorage.getItem(this.usersKey);
    return data ? JSON.parse(data) : [];
  }

  private saveUsers(users: any[]): void {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    this.usersSubject.next(users);
  }

  getUsers(): Observable<any[]> {
    return of(this.loadUsers()).pipe(
      catchError(err => {
        console.error('Failed to fetch users', err);
        return throwError(() => new Error('Failed to fetch users'));
      })
    );
  }

  emailExists(email: string): boolean {
    const users = this.loadUsers();
    return users.some(user => user.email === email);
  }

  registerUser(user: any): void {
    const users = this.loadUsers();
    users.push(user);
    this.saveUsers(users);
    this.usersSubject.next(users);
  }

  getUserRole(): string | null {
    const user = this.loggedinUser();
    if (user) {      
      try {
        return this.loggedinUser()?.role;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  loggedinUser(): any {
    const data = localStorage.getItem(this.currentUser);
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean {
    return !!this.loggedinUser();
  }

  logout() {
    localStorage.removeItem('currentUser');
  }
}

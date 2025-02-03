import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usersKey = 'users';
  private usersSubject = new BehaviorSubject<any[]>(this.loadUsers());
  users$ = this.usersSubject.asObservable();

  constructor() {}

  private loadUsers(): any[] {
    const data = localStorage.getItem(this.usersKey);
    return data ? JSON.parse(data) : [];
  }

  private saveUsers(users: any[]): void {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
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
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private usersKey = 'users';
  private currentUserKey = 'currentUser';

  getCurrentUser(): any {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  updateUser(updatedData: any): void {
    let users = this.loadUsers();
    const currentUser = this.getCurrentUser();

    if (!currentUser) return;

    users = users.map(user =>
      user.email === currentUser.email ? { ...user, ...updatedData } : user
    );

    localStorage.setItem(this.usersKey, JSON.stringify(users));
    localStorage.setItem(this.currentUserKey, JSON.stringify({ ...currentUser, ...updatedData }));
  }

  private loadUsers(): any[] {
    const data = localStorage.getItem(this.usersKey);
    return data ? JSON.parse(data) : [];
  }
}

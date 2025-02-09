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
      role: 'Collector',
      points: 0
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
      role: 'Collector',
      points: 0
    }
  ];
  private usersSubject = new BehaviorSubject<any[]>(this.loadUsers());
  users$ = this.usersSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<any>(this.loggedinUser());

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
    const newUser = { ...user, points: 0 };
    users.push(newUser);
    this.saveUsers(users);
    this.usersSubject.next(users);
  }

  login(email: string, password: string): boolean {
    const users = this.loadUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(this.currentUser, JSON.stringify(user));
      this.currentUserSubject.next(user);
      return true;
    }
    return false;
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

  updateUserPoints(newPoints: number, targetUserEmail: string): void {
    const allUsers = this.loadUsers();
    const targetUser = allUsers.find(user => user.email === targetUserEmail);
    
    if (!targetUser) {
        console.error('User not found with email:', targetUserEmail);
        return;
    }

    const updatedUsers = allUsers.map(user => {
        if (user.email === targetUserEmail) {
            const newTotal = (user.points || 0) + newPoints;
            return { ...user, points: newTotal };
        }
        return user;
    });

    this.saveUsers(updatedUsers);

    const currentUser = this.loggedinUser();
    if (currentUser?.email === targetUserEmail) {
        const updatedCurrentUser = { ...currentUser, points: (currentUser.points || 0) + newPoints };
        localStorage.setItem(this.currentUser, JSON.stringify(updatedCurrentUser));
        this.currentUserSubject.next(updatedCurrentUser);
    }
}

getCurrentUserObservable(): Observable<any> {
    return this.currentUserSubject.asObservable();
}

convertPointsToVoucher(userEmail: string, points: number): { success: boolean, message: string } {
  const allUsers = this.loadUsers();
  const user = allUsers.find(u => u.email === userEmail);

  if (!user) {
    return { success: false, message: 'Utilisateur non trouvé.' };
  }

  if (user.points < points) {
    return { success: false, message: 'Points insuffisants pour la conversion.' };
  }

  const voucherRates = [
    { points: 100, value: 50 },
    { points: 200, value: 120 },
    { points: 500, value: 350 }
  ];

  const bestVoucher = voucherRates
    .filter(rate => points >= rate.points)
    .sort((a, b) => b.points - a.points)[0];

  if (!bestVoucher) {
    return { success: false, message: 'Le nombre de points ne correspond à aucun bon d\'achat.' };
  }

  user.points -= bestVoucher.points;
  user.vouchers = user.vouchers || [];
  user.vouchers.push({
    value: bestVoucher.value,
    date: new Date().toISOString(),
    code: this.generateVoucherCode()
  });

  const updatedUsers = allUsers.map(u => (u.email === userEmail ? user : u));
  this.saveUsers(updatedUsers);

  const currentUser = this.loggedinUser();
  if (currentUser?.email === userEmail) {
    localStorage.setItem(this.currentUser, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  return { success: true, message: `Bon d'achat de ${bestVoucher.value} Dh généré avec succès.` };
}

private generateVoucherCode(): string {
  return 'VOUCHER-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}
}

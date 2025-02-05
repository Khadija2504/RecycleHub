import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private requestsKey = 'collectionRequests';
  private requestIdKey = 'requestId';
  private requests: any[] = [];
  private requestId = 1;
  private currentUser = 'currentUser';
  constructor() {
    this.loadRequests();
  }

  private loadRequests(): void {
    const storedRequests = localStorage.getItem(this.requestsKey);
    this.requests = storedRequests ? JSON.parse(storedRequests) : [];

    const storedRequestId = localStorage.getItem(this.requestIdKey);
    this.requestId = storedRequestId ? parseInt(storedRequestId, 10) : 1;
  }

  loggedinUser(): any {
    const data = localStorage.getItem(this.currentUser);
    return data ? JSON.parse(data) : null;
  }

  private saveRequests(): void {
    localStorage.setItem(this.requestsKey, JSON.stringify(this.requests));
    localStorage.setItem(this.requestIdKey, this.requestId.toString());
  }

  getUserRequests(): any[] {
    console.log('requests:', this.requests);
    
    console.log('loggedin user:', this.loggedinUser()?.email);
  
    const userRequests = this.requests.filter(
      request => request.status === 'en attente' && request.userEmail === this.loggedinUser()?.email
    );
  
    console.log('filtered requests:', userRequests);
  
    return userRequests;
  }

  addRequest(requestData: any): void {
    requestData.id = this.requestId++;
    this.requests.push(requestData);
    this.saveRequests();
  }

  deleteRequest(requestId: number): void {
    this.requests = this.requests.filter(request => request.id !== requestId);
    this.saveRequests();
  }
}

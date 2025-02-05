import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private requestsKey = 'collectionRequests';
  private requestIdKey = 'requestId';
  private requests: any[] = [];
  private requestId = 1;

  constructor() {
    this.loadRequests();
  }

  private loadRequests(): void {
    const storedRequests = localStorage.getItem(this.requestsKey);
    this.requests = storedRequests ? JSON.parse(storedRequests) : [];

    const storedRequestId = localStorage.getItem(this.requestIdKey);
    this.requestId = storedRequestId ? parseInt(storedRequestId, 10) : 1;
  }

  private saveRequests(): void {
    localStorage.setItem(this.requestsKey, JSON.stringify(this.requests));
    localStorage.setItem(this.requestIdKey, this.requestId.toString());
  }

  getUserRequests(): any[] {
    return this.requests.filter(request => request.status === 'en attente');
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

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CollectionRequestService {

  private requestsKey = 'collectionRequests';

  constructor() {}

  getRequests(): any[] {
    const data = localStorage.getItem(this.requestsKey);
    return data ? JSON.parse(data) : [];
  }

  addRequest(request: any): void {
    const requests = this.getRequests();
    requests.push(request);
    localStorage.setItem(this.requestsKey, JSON.stringify(requests));
  }
}

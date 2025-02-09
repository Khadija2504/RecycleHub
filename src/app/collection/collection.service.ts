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
    console.log('Requests after loading:', this.requests);
  }

  private loadRequests(): void {
    const storedRequests = localStorage.getItem(this.requestsKey);
    try {
      this.requests = storedRequests ? JSON.parse(storedRequests) : [];
      if (!Array.isArray(this.requests)) {
        this.requests = [];
      }
    } catch (error) {
      console.error('Error parsing requests from localStorage', error);
      this.requests = [];
    }
  
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
    if (!Array.isArray(this.requests)) {
      console.error('this.requests is not an array!', this.requests);
      return [];
    }

    const userEmail = this.loggedinUser()?.email;
    console.log('loggedin user:', userEmail);

    const userRequests = this.requests.filter(
      request => request.status === 'en attente' && request.userEmail === userEmail
    );

    console.log('filtered requests:', userRequests);
    return userRequests;
}

  getRequestById(id: number): any {
    const requests = this.getUserRequests();
    console.log('Stored requests:', requests);

    const request = requests.find(req => req.id === id);

    if (request) {
      return request;
    } else {
      console.error(`Request with ID ${id} not found.`);
    }
  }

  getUserRequestsByCity() : any[] {
    console.log('requests:', this.requests);
    if (!Array.isArray(this.requests)) {
      console.error('this.requests is not an array!', this.requests);
      return [];
    }

    const address = this.loggedinUser()?.address;
    console.log('loggedin user:', address);

    const userRequests = this.requests.filter(
      request => request.status === 'en attente' && request.address === address
    );

    console.log('filtered requests:', userRequests);
    return userRequests;
  }

  getAllRequests() : any[] {
    if(!Array.isArray(this.requests)) {
      console.error('this.requests is not an array!', this.requests);
      return [];
    }
    const email = this.loggedinUser()?.email;
    const userRequests = this.requests.filter(
      request => request.userEmail == email
    );

    return userRequests;
  }

  getAllUserRequests() : any[] {
    console.log('requests:', this.requests);
    if (!Array.isArray(this.requests)) {
      console.error('this.requests is not an array!', this.requests);
      return [];
    }

    const address = this.loggedinUser()?.address;
    console.log('loggedin user:', address);

    const userRequests = this.requests.filter(
      request => request.address === address
    );

    // console.log(this.requests.filter(
    //   request => request.id === 18
    // ));
    
    // console.log('filtered requests:', userRequests);
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

  updateRequest(requestId: number, updatedData: any): void {
    const request = this.requests.find((req) => req.id === requestId);
    if (request) {
      request.wasteItems = request.wasteItems.map((item: any, index: number) => ({
        ...item,
        actualWeight: updatedData.wasteItems[index].actualWeight,
        verifiedType: updatedData.wasteItems[index].wasteType
      }));
      
      request.images = updatedData.images || request.images;
      request.status = updatedData.status || request.status;
      
      this.saveRequests();
    } else {
      console.error(`Request with ID ${requestId} not found.`);
    }
  }

  updateRequestStatus(requestId: number, newStatus: string): void {
    const request = this.requests.find((req) => req.id === requestId);
    if (request) {
      request.status = newStatus;
      this.saveRequests();
      console.log(`Request ${requestId} status updated to ${newStatus}`);
    } else {
      console.error(`Request with ID ${requestId} not found.`);
    }
  }
  
}

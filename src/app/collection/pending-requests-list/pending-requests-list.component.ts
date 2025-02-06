import { Component } from '@angular/core';
import { CollectionService } from '../collection.service';

@Component({
  selector: 'app-pending-requests-list',
  standalone: false,
  
  templateUrl: './pending-requests-list.component.html',
  styleUrl: './pending-requests-list.component.css'
})
export class PendingRequestsListComponent {
  collectionRequests: any[] = [];
    userId: number = 0;
  
    constructor(private collectionService: CollectionService) {}
  
    ngOnInit(): void {
      this.loadUserRequests();
    }
  
    loadUserRequests(): void {
      this.collectionRequests = this.collectionService.getUserRequestsByCity();
    }
  
    getTotalWeight(wasteItems: any[]): number {
      return wasteItems.reduce((total, item) => total + item.estimatedWeight, 0);
    }
  
    deleteRequest(requestId: number): void {
      this.collectionService.deleteRequest(requestId);
      this.loadUserRequests();
    }
}

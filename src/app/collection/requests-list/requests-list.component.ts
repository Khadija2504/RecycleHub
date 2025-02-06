import { Component } from '@angular/core';
import { CollectionService } from '../collection.service';

@Component({
  selector: 'app-requests-list',
  standalone: false,
  
  templateUrl: './requests-list.component.html',
  styleUrl: './requests-list.component.css'
})
export class RequestsListComponent {
  collectionRequests: any[] = [];
  userId: number = 0;

  constructor(private collectionService: CollectionService) {}

  ngOnInit(): void {
    this.loadUserRequests();
  }

  loadUserRequests(): void {
    this.collectionRequests = this.collectionService.getAllUserRequests();
  }

  getTotalWeight(wasteItems: any[]): number {
    return wasteItems.reduce((total, item) => total + item.estimatedWeight, 0);
  }

  deleteRequest(requestId: number): void {
    this.collectionService.deleteRequest(requestId);
    this.loadUserRequests();
  }

  updateStatus(requestId: number, newStatus: string): void {
    this.collectionService.updateRequestStatus(requestId, newStatus);
    this.loadUserRequests();
  }
}

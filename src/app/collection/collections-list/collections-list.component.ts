import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../collection.service';

@Component({
  selector: 'app-collections-list',
  standalone: false,
  templateUrl: './collections-list.component.html',
  styleUrls: ['./collections-list.component.css']
})
export class CollectionsListComponent implements OnInit {
  collectionRequests: any[] = [];
  userId: number = 0;

  constructor(private collectionService: CollectionService) {}

  ngOnInit(): void {
    this.loadUserRequests();
  }

  loadUserRequests(): void {
    this.collectionRequests = this.collectionService.getAllRequests();
  }

  getTotalWeight(wasteItems: any[]): number {
    return wasteItems.reduce((total, item) => total + item.estimatedWeight, 0);
  }

  deleteRequest(requestId: number): void {
    this.collectionService.deleteRequest(requestId);
    this.loadUserRequests();
  }
}

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
  showValidationModal: boolean = false;
  validationData: any = {
    wasteType: '',
    actualWeight: null,
    image: null,
    imagePreview: null,
  };
  selectedRequestId: number | null = null;
  
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

    updateStatus(requestId: number, newStatus: string): void {
      this.collectionService.updateRequestStatus(requestId, newStatus);
      this.loadUserRequests();
    }
    
    openValidationModal(request: any): void {
      this.selectedRequestId = request.id;
      this.showValidationModal = true;
    }
  
    closeValidationModal(): void {
      this.showValidationModal = false;
      this.resetValidationData();
    }
  
    onFileSelected(event: any): void {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.validationData.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
        this.validationData.image = file;
      }
    }  

    submitValidation(): void {
      if (this.selectedRequestId && this.validationData.actualWeight) {
        const updatedData = {
          wasteType: this.validationData.wasteType,
          actualWeight: this.validationData.actualWeight,
          image: this.validationData.image,
          status: 'validée', // Update status to "validée"
        };
  
        this.collectionService.updateRequest(this.selectedRequestId, updatedData);
        this.closeValidationModal();
        this.loadUserRequests();
      } else {
        alert('Veuillez remplir tous les champs obligatoires.');
      }
    }
  
    resetValidationData(): void {
      this.validationData = {
        wasteType: '',
        actualWeight: null,
        image: null,
        imagePreview: null,
      };
    }
}

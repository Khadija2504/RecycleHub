import { Component } from '@angular/core';
import { CollectionService } from '../collection.service';

@Component({
  selector: 'app-requests-list',
  standalone: false,
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.css'], // Fixed property name
})
export class RequestsListComponent {
  collectionRequests: any[] = [];
  showValidationModal: boolean = false;
  validationData: {
    wasteItems: {
      wasteType: string;
      actualWeight: number | null;
    }[];
    images: File | null;
    imagePreview: string | null;
  } = {
    wasteItems: [],
    images: null,
    imagePreview: null
  };
  selectedRequest: any = null;

  constructor(private collectionService: CollectionService) {}

  ngOnInit(): void {
    this.loadUserRequests();
  }

  loadUserRequests(): void {
    this.collectionRequests = this.collectionService.getAllUserRequests();
  }

  getTotalWeight(wasteItems: any[]): number {
    return wasteItems.reduce((total, item) => total + (item.estimatedWeight || 0), 0);
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
    this.selectedRequest = request;
    this.validationData = {
      wasteItems: request.wasteItems.map((item: any) => ({
        wasteType: item.wasteType,
        actualWeight: item.estimatedWeight
      })),
      images: null,
      imagePreview: null
    };
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
      this.validationData.images = file;
    }
  }

  submitValidation(): void {
    const isValid = this.validationData.wasteItems.every(item => 
      item.wasteType && item.actualWeight && item.actualWeight > 0
    );

    if (!isValid) {
      alert('Veuillez remplir tous les champs obligatoires pour chaque type de déchet.');
      return;
    }

    const updatedData = {
      wasteItems: this.selectedRequest.wasteItems.map((item: any, index: number) => ({
        ...item,
        actualWeight: this.validationData.wasteItems[index].actualWeight,
        verifiedType: this.validationData.wasteItems[index].wasteType
      })),
      images: this.validationData.images,
      status: this.allItemsVerified() ? 'validée' : 'rejetée'
    };

    this.collectionService.updateRequest(this.selectedRequest.id, updatedData);
    this.closeValidationModal();
    this.loadUserRequests();
  }

  private allItemsVerified(): boolean {
    return this.validationData.wasteItems.every(item => 
      item.actualWeight && item.actualWeight > 0
    );
  }

  resetValidationData(): void {
    this.validationData = {
      wasteItems: [],
      images: null,
      imagePreview: null
    };
    this.selectedRequest = null;
  }
}

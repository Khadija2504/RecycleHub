import { Component } from '@angular/core';
import { CollectionService } from '../collection.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-requests-list',
  standalone: false,
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.css'],
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

  private readonly pointsMap: { [key: string]: number } = {
    'Plastic': 2,
    'Glass': 1,
    'Paper': 1,
    'Metal': 5
  };

  constructor(
    private collectionService: CollectionService, 
    private authService: AuthService,
  ) {}

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
      alert('Please fill all required fields for each waste type.');
      return;
    }

    let totalPoints = 0;
    const updatedWasteItems = this.selectedRequest.wasteItems.map((item: any, index: number) => {
      const actualWeight = this.validationData.wasteItems[index].actualWeight || 0;
      const weightKg = actualWeight / 1000;
      const points = Math.round(weightKg * this.pointsMap[item.wasteType]);
      totalPoints += points;

      return {
        ...item,
        actualWeight: actualWeight,
        verifiedType: this.validationData.wasteItems[index].wasteType,
        points: points
      };
    });

    const targetUserEmail = this.selectedRequest.userEmail;
    
    this.authService.updateUserPoints(totalPoints, targetUserEmail);

    const updatedData = {
      wasteItems: updatedWasteItems,
      images: this.validationData.images,
      status: this.allItemsVerified() ? 'validée' : 'rejetée',
      totalPoints: totalPoints
    };

    this.collectionService.updateRequest(this.selectedRequest.id, updatedData);
    this.closeValidationModal();
    this.loadUserRequests();
  }

  private calculatePoints(wasteType: string, weightKg: number): number {
    return Math.round(weightKg * (this.pointsMap[wasteType] || 0));
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

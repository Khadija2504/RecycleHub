import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollectionService } from '../collection.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-collection-request',
  standalone: false,
  templateUrl: './collection-request.component.html',
  styleUrls: ['./collection-request.component.css']
})
export class CollectionRequestComponent implements OnInit {
  collectionForm: FormGroup;
  selectedImages: (string | ArrayBuffer | null)[] = [];
  existingRequests: any[] = [];

  constructor(private fb: FormBuilder, private collectionService: CollectionService, private authService: AuthService) {
    const user = this.authService.loggedinUser();
    this.collectionForm = this.fb.group({
      wasteItems: this.fb.array([this.createWasteItem()]),
      address: ['', Validators.required],
      timeSlot: ['', [Validators.required, this.validateTimeSlot]],
      notes: [''],
      status: ['en attente'],
      userEmail: [user?.email],
      images: [[]]
    });
  }

  ngOnInit(): void {
    this.loadExistingRequests();
  }

  createWasteItem(): FormGroup {
    return this.fb.group({
      wasteType: ['', Validators.required],
      estimatedWeight: [[Validators.required, Validators.min(1000)]]
    });
  }

  get wasteItems(): FormArray {
    return this.collectionForm.get('wasteItems') as FormArray;
  }

  addWasteItem(): void {
    this.wasteItems.push(this.createWasteItem());
  }

  removeWasteItem(index: number): void {
    this.wasteItems.removeAt(index);
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
  
      reader.onload = (e) => {
        if (e.target?.result) {
          this.selectedImages.push(e.target.result as string);
        }
      };
  
      reader.readAsDataURL(file);
    }
  }

  getTotalWeight(): number {
    return this.wasteItems.value.reduce((total: number, item: any) => total + Number(item.estimatedWeight), 0);
  }

  validateTimeSlot(control: any): { [key: string]: any } | null {
    const time = control.value;
    if (!time) return null;

    const [hours, minutes] = time.split(':').map(Number);
    if (hours < 9 || hours > 18 || (hours === 18 && minutes > 0)) {
      return { invalidTimeSlot: true };
    }
    return null;
  }

  loadExistingRequests(): void {
    this.existingRequests = this.collectionService.getUserRequests();
  }

  submitRequest(): void {
    if (this.collectionForm.invalid) {
      alert('Veuillez remplir tous les champs correctement.');
      return;
    }
  
    const totalWeight = this.getTotalWeight();
    if (totalWeight < 1000 || totalWeight > 10000) {
      alert('Le poids total doit être entre 1000g et 10000g.');
      return;
    }
  
    this.collectionForm.patchValue({ status: 'en attente' });
    this.collectionService.addRequest(this.collectionForm.value);
  
    console.log("Collection Request:", this.collectionForm.value);
    alert('Demande de collecte soumise avec succès !');
    this.collectionForm.reset();
  }

  deleteRequest(requestId: number): void {
    this.collectionService.deleteRequest(requestId);
    this.loadExistingRequests();
  }
}

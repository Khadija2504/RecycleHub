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
      images: this.fb.array([])
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
    if (!files || files.length === 0) return;

    this.selectedImages = [];
    const imagesControl = this.collectionForm.get('images') as FormArray;
    imagesControl.clear();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          const imageData = e.target.result as string;
          this.selectedImages.push(imageData);
          imagesControl.push(this.fb.control(imageData));
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

    if(this.collectionService.getUserRequests().length > 3) {
      alert('Vous n\'avez pas d\'ajouter plus de trois collectes en attente');
      return;
    }
  
    const totalWeight = this.getTotalWeight();
    if (totalWeight < 1000 || totalWeight > 10000) {
      alert('Le poids total doit être entre 1000g et 10000g.');
      return;
    }
  
    const newRequest = {
      ...this.collectionForm.value,
      id: Date.now(),
      status: 'en attente',
      images: this.collectionForm.value.images
    };

    this.collectionService.addRequest(newRequest);
    
    this.collectionForm.reset({
      wasteItems: this.fb.array([this.createWasteItem()]),
      status: 'en attente',
      userEmail: this.authService.loggedinUser()?.email,
      images: []
    });
    this.selectedImages = [];
  }
}

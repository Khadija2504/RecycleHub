import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollectionService } from '../collection.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-edit-collection',
  standalone: false,
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.css']
})
export class EditCollectionComponent implements OnInit {
  collectionForm: FormGroup;
  selectedImages: (string | ArrayBuffer | null)[] = [];
  requestId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private collectionService: CollectionService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.collectionForm = this.fb.group({
      wasteItems: this.fb.array([this.createWasteItem()]),
      address: ['', Validators.required],
      timeSlot: ['', [Validators.required, this.validateTimeSlot]],
      notes: [''],
      status: ['en attente'],
      userEmail: [this.authService.loggedinUser()?.email],
      images: [[]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.requestId = +params['id'];
      this.loadRequestForEdit(this.requestId);
    });
  }

  createWasteItem(): FormGroup {
    return this.fb.group({
      wasteType: ['', Validators.required],
      estimatedWeight: ['', [Validators.required, Validators.min(1000)]],
      isNew: [true]
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

  validateTimeSlot(control: any): { [key: string]: any } | null {
    const time = control.value;
    if (!time) return null;

    const [hours, minutes] = time.split(':').map(Number);
    if (hours < 9 || hours > 18 || (hours === 18 && minutes > 0)) {
      return { invalidTimeSlot: true };
    }
    return null;
  }

  loadRequestForEdit(requestId: number): void {
    const request = this.collectionService.getRequestById(requestId);
    if (request) {
      // Reset form array completely
      while (this.wasteItems.length) {
        this.wasteItems.removeAt(0);
      }
  
      // Rebuild form array from request data
      request.wasteItems.forEach((item: any) => {
        const wasteItemGroup = this.createWasteItem();
        wasteItemGroup.patchValue({
          wasteType: item.wasteType,
          estimatedWeight: item.estimatedWeight
        });
        this.wasteItems.push(wasteItemGroup);
      });
  
      // Load other values
      this.collectionForm.patchValue({
        address: request.address,
        timeSlot: request.timeSlot,
        notes: request.notes,
        status: request.status,
        userEmail: request.userEmail,
        images: request.images || []
      });
      this.selectedImages = request.images || [];
    }
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }

  submitRequest(): void {
    this.collectionForm.patchValue({
      images: this.selectedImages
    });
  
    if (this.collectionForm.invalid) {
      Object.values(this.collectionForm.controls).forEach(control => {
        control.markAsTouched();
      });
      alert('Veuillez remplir tous les champs correctement.');
      return;
    }
  
    const formData = {
      ...this.collectionForm.value,
      id: this.requestId
    };
  
    if (this.requestId) {
      this.collectionService.updateRequest(this.requestId, formData);
      alert('Demande de collecte mise à jour avec succès !');
      this.router.navigate(['/collection/collections-list']);
    } else {
      alert('ID de demande invalide.');
    }
  }

  getTotalWeight(): number {
    return this.wasteItems.value.reduce((total: number, item: any) => total + Number(item.estimatedWeight), 0);
  }
}

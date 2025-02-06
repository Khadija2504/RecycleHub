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
      while (this.wasteItems.length) {
        this.wasteItems.removeAt(0);
      }

      this.collectionForm.patchValue({
        address: request.address,
        timeSlot: request.timeSlot,
        notes: request.notes,
        status: request.status,
        userEmail: request.userEmail,
        images: request.images,
      });

      request.wasteItems.forEach((item: any) => {
        const wasteItemGroup = this.createWasteItem();
        wasteItemGroup.patchValue(item);
        this.wasteItems.push(wasteItemGroup);
      });

      this.selectedImages = request.images || [];
    } else {
      console.error('Request not found');
    }
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

    if (this.requestId) {
      this.collectionService.updateRequest(this.requestId, this.collectionForm.value);
      alert('Demande de collecte mise à jour avec succès !');
      this.router.navigate(['/collection/requests-list']);
    } else {
      alert('ID de demande invalide.');
    }
  }

  getTotalWeight(): number {
    return this.wasteItems.value.reduce((total: number, item: any) => total + Number(item.estimatedWeight), 0);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollectionService } from '../collection.service';

@Component({
  selector: 'app-edit-collection',
  standalone: false,
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.css']
})
export class EditCollectionComponent implements OnInit {
  editForm: FormGroup;
  wasteTypes = ['Plastic', 'Glass', 'Paper', 'Organic', 'Electronic'];
  request: any;

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService
  ) {
    this.editForm = this.fb.group({
      wasteType: ['', Validators.required],
      images: [[]], 
      estimatedWeight: ['', [Validators.required, Validators.min(1000)]],
      address: ['', Validators.required],
      timeSlot: ['', [Validators.required, this.validateTimeSlot]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRequest(Number(id));
    }
  }
  
  loadRequest(id: number): void {
    const requests = this.collectionService.getUserRequests();
    console.log('Stored requests:', requests);
  
    const request = requests.find(req => req.id === id);
  
    if (request) {
      this.request = request;
      console.log('Loaded request:', this.request);
      this.patchFormData();
    } else {
      console.error(`Request with ID ${id} not found.`);
    }
  }

  patchFormData(): void {
    if (this.request) {
      const wasteItem = this.request.wasteItems[0] || {}; 
      console.log('Waste Item:', wasteItem);
      
      this.editForm.patchValue({
        wasteType: wasteItem.wasteType || '',
        images: this.request.images || [],
        estimatedWeight: wasteItem.estimatedWeight || '',
        address: this.request.address,
        timeSlot: this.request.timeSlot,
        notes: this.request.notes,
        id: this.request.id,

      });
      
      console.log('Form after patching:', this.editForm.value);
    }
  }
  
  validateTimeSlot(control: any): { [key: string]: any } | null {
    const selectedTime = control.value;
    if (!selectedTime) return null;
    const [hours] = selectedTime.split(':').map(Number);
    return hours < 9 || hours > 18 ? { invalidTime: true } : null;
  }

  onImageUpload(event: any): void {
    const files = Array.from(event.target.files);
    this.editForm.patchValue({ images: files });
  }

  saveEdit(): void {
    console.log("Save edit function triggered");
  
    if (this.editForm.valid) {
      const updatedData = this.editForm.value;
      
      if (this.request && this.request.id) {
        this.collectionService.updateRequest(this.request.id, updatedData);
        console.log("Updated request:", updatedData);
        
        this.router.navigate(['/collection/collections-list']);
      } else {
        console.error("Request ID is missing. Unable to update.");
      }
    } else {
      console.warn("Form is invalid. Please check your inputs.");
    }
  }
  

  cancelEdit(): void {
    this.router.navigate(['/collection']);
  }
}

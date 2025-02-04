import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-collection-request',
  standalone: false,
  
  templateUrl: './collection-request.component.html',
  styleUrl: './collection-request.component.css'
})

export class CollectionRequestComponent implements OnInit {

  collectionForm!: FormGroup;
  selectedImage: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.collectionForm = this.fb.group({
      wasteType: ['', Validators.required],
      estimatedWeight: ['', [Validators.required, Validators.min(1)]],
      address: ['', Validators.required],
      timeSlot: ['', Validators.required],
      photo: [null]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => this.selectedImage = e.target?.result ?? null;
      reader.readAsDataURL(file);
      this.collectionForm.patchValue({ photo: file });
    }
  }

  submitRequest(): void {
    if (this.collectionForm.valid) {
      const requestData = this.collectionForm.value;
      console.log('Collection Request:', requestData);
      alert('Collection request submitted successfully!');
      this.collectionForm.reset();
      this.selectedImage = null;
    } else {
      alert('Please fill in all required fields.');
    }
  }
}

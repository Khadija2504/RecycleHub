import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingRequestsListComponent } from './pending-requests-list.component';

describe('PendingRequestsListComponent', () => {
  let component: PendingRequestsListComponent;
  let fixture: ComponentFixture<PendingRequestsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PendingRequestsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

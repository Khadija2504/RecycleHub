import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherConversionComponent } from './voucher-conversion.component';

describe('VoucherConversionComponent', () => {
  let component: VoucherConversionComponent;
  let fixture: ComponentFixture<VoucherConversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoucherConversionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// voucher-conversion.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-voucher-conversion',
  standalone: false,
  templateUrl: './voucher-conversion.component.html',
  styleUrls: ['./voucher-conversion.component.css']
})
export class VoucherConversionComponent {
  pointsToConvert: number | null = null;
  conversionResult: { success: boolean, message: string } | null = null;

  constructor(private authService: AuthService) {}

  convertPoints(): void {
    if (!this.pointsToConvert || this.pointsToConvert <= 0) {
      this.conversionResult = { success: false, message: 'Veuillez entrer un nombre de points valide.' };
      return;
    }

    const user = this.authService.loggedinUser();
    if (!user) {
      this.conversionResult = { success: false, message: 'Vous devez être connecté pour convertir vos points.' };
      return;
    }

    this.conversionResult = this.authService.convertPointsToVoucher(user.email, this.pointsToConvert);
  }
}
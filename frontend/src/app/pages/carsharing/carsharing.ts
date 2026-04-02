import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  CarsharingService,
  AvailableRide,
  CreateRide,
  RideResponse,
} from '../../services/carsharing';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);
@Component({
  selector: 'app-carsharing',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-PT' },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-PT' },
  ],
  templateUrl: './carsharing.html',
  styleUrl: './carsharing.css',
})
export class CarsharingComponent implements OnInit {
  private rideService = inject(CarsharingService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  public rides: AvailableRide[] = [];
  public loading = false;
  public showForm = false;
  public offerForm: FormGroup;
  public currentUserId = localStorage.getItem('id');

  constructor() {
    this.offerForm = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      seats: [1, [Validators.required, Validators.min(1)]],
      cost: [0, [Validators.required, Validators.min(0)]],
      date: [new Date(), Validators.required],
      time: ['12:00', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadRides();
  }

  private showMessage(msg: string, isError = false) {
    this.snackBar.open(msg, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar'],
    });
  }

  loadRides(): void {
    this.loading = true;
    this.rideService.getRides().subscribe({
      next: (data) => {
        this.rides = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar do Supabase', err);
        this.loading = false;
      },
    });
  }

  bookSeat(rideId: number, seats: number): void {
    if (seats <= 0) return;
    this.loading = true;
    this.rideService.bookSeat(rideId).subscribe({
      next: (res: RideResponse) => {
        this.loading = false;
        const co2Msg = res.saved_co2 ? `Poupaste ${res.saved_co2} kg de de CO₂! 🌱` : '';
        this.showMessage(`Lugar reservado com sucesso! ${co2Msg}`);
        this.router.navigate(['/history']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.showMessage(err.error?.message || 'Erro ao reservar lugar', true);
      },
    });
  }

  createOffer(): void {
    if (this.offerForm.valid) {
      this.loading = true;

      const formValue = this.offerForm.value;
      const rideData: CreateRide = {
        ...formValue,
        date: new Date(formValue.date).toISOString().split('T')[0],
      };

      this.rideService.createRide(rideData).subscribe({
        next: (res: RideResponse) => {
          this.loading = false;
          this.showForm = false;
          this.offerForm.reset({
            seats: 1,
            cost: 0,
            date: new Date(),
            time: '12:00',
          });

          if (res.ride) this.rides = [...this.rides, res.ride];
          this.showMessage('Boleia publicada com sucesso! 🚙');
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.showMessage(err.error?.message || 'Erro ao criar oferta', true);
        },
      });
    }
  }
}

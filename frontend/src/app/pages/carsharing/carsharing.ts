import { Component, OnInit, inject } from '@angular/core';
import { CommonModule} from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CarsharingService, AvailableRide, CreateRide, RideResponse } from '../../services/carsharing';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'

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

  ],
  templateUrl: './carsharing.html',
  styleUrl: './carsharing.css',
})
export class CarsharingComponent implements OnInit {
  private rideService = inject(CarsharingService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar)
  public rides: AvailableRide[] = [];
  public loading = false;
  public showForm = false;
  public offerForm: FormGroup;


  constructor() {
    this.offerForm = this.fb.group({
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      seats: [1, [Validators.required, Validators.min(1)]],
      cost: [0, [Validators.required, Validators.min(0)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      time: ['12:00', Validators.required]
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
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar']
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
      }
    });
  }

  bookSeat(rideId: number): void {
    console.log('Botao clicando!')
    this.loading = true;
    this.rideService.bookSeat(rideId).subscribe({
      next: (res: RideResponse) => {
        this.loading = false;

        alert(res.message || 'Lugar reservado com sucesso! 🌱');
        this.router.navigate(['/history']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        console.error('Não foi possível reservar: ', err.error.message);
      }
    });
  }

  createOffer(): void {
  if (this.offerForm.valid) {
    this.loading = true;

    const rideData: CreateRide = this.offerForm.value;

    this.rideService.createRide(rideData).subscribe({
      next: (res: RideResponse) => {
        alert(res.message);
        this.loading = false;
        this.showForm = false;
        this.offerForm.reset({
          seats: 1, cost: 0, date: new Date().toISOString().split('T')[0], time: '12:00'});

        this.loadRides(); // Recarrega a lista para mostrar a nova boleia
        this.showMessage('Boleia publicada com sucesso! 🚙');
      },
      error: (err: HttpErrorResponse) => {
        this.showMessage('Erro ao criar oferta', (err.error?.message || 'Servidor Offline'));
        this.loading = false;
      }
    });
  }
}
}

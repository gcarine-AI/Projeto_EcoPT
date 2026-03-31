import { Component, OnInit, inject } from '@angular/core';
import { CommonModule} from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CarsharingService, AvailableRide } from '../../services/carsharing';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
    ReactiveFormsModule
  ],
  templateUrl: './carsharing.html',
  styleUrl: './carsharing.css',
})
export class CarsharingComponent implements OnInit {
  private rideService = inject(CarsharingService);
  private fb = inject(FormBuilder)
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
    this.loading = true;
    this.rideService.bookSeat(rideId).subscribe({
      next: (res) => {
        alert(res.message);
        this.loadRides(); // Recarrega a lista para mostrar menos 1 lugar
      },
      error: (err) => {
        console.error('Erro ao reservar', err);
        this.loading = false;
      }
    });
  }

  createOffer(): void {
  if (this.offerForm.valid) {
    this.loading = true;
    this.rideService.createRide(this.offerForm.value).subscribe({
      next: () => {
        this.showForm = false;
        this.offerForm.reset({ seats: 1, cost: 0 });
        this.loadRides(); // Recarrega a lista para mostrar a nova boleia
      },
      error: (err) => {
        console.error('Erro ao criar oferta', err);
        this.loading = false;
      }
    });
  }
}
}

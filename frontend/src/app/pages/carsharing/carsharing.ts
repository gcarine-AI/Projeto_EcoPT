import { Component, OnInit, inject } from '@angular/core';
import { CommonModule} from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CarsharingService, AvailableRide } from '../../services/carsharing';

@Component({
  selector: 'app-carsharing',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  templateUrl: './carsharing.html',
  styleUrl: './carsharing.css',
})
export class CarsharingComponent implements OnInit {
  private rideService = inject(CarsharingService);
  public rides: AvailableRide[] = [];
  public loading = false;


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
}

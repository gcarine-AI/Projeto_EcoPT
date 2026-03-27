import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CarsharingService, AvailableRide } from '../../services/carsharing';


@Component({
  selector: 'app-carsharing',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, CurrencyPipe, DatePipe],
  templateUrl: './carsharing.html',
  styleUrl: './carsharing.css'
})
export class CarsharingComponent implements OnInit {
  private rideService = inject(CarsharingService);
  rides: AvailableRide[] = []

  ngOnInit(): void {
    this.loadRides();
  }

  loadRides(): void {
    this.rideService.getRides().subscribe({
      next: (data) => this.rides = data,
      error: (err) => console.error('Erro ao carregar do Supabase', err)
    });
  }

    bookSeat(rideId: number): void {
    this.rideService.bookSeat(rideId).subscribe({
      next: () => {
        alert('Reserva efetuada com sucesso! O Supabase foi atualizado.');
        this.loadRides(); // Recarrega a lista para mostrar menos 1 lugar
      }
    });
  }
}


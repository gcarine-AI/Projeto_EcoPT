import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AvailableRide {
  id: number;
  driver: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  cost: number;
}

@Injectable({ providedIn: 'root' })
export class CarsharingService {
  private http = inject(HttpClient);

  // Ajustado para coincidir com o Router: app.use('/api/carsharing', ...)
  private apiUrl = 'http://localhost:3000/api/carsharing';

  // GET: Vai buscar a lista ao endpoint /api/carsharing/available
  getRides(): Observable<AvailableRide[]> {
    return this.http.get<AvailableRide[]>(`${this.apiUrl}/available`);
  }

  // PATCH: Faz o update no endpoint /api/carsharing/book/:id
  
  bookSeat(id: number): Observable<{message: string}> {
    return this.http.patch<{message: string}>(`${this.apiUrl}/book/${id}`, {});
  }
}

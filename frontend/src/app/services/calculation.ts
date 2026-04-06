import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Calculation, ComparisonData } from '../models/calculation.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class CalculationService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/calculations`

  create(data: Calculation): Observable<Calculation> {
    return this.http.post<Calculation>(this.API_URL, data);
  }


  list(): Observable<Calculation[]> {
    return this.http.get<Calculation[]>(this.API_URL);
  }

  getById(id: string): Observable<Calculation> {
    return this.http.get<Calculation>(`${this.API_URL}/${id}`);
  }

  update(id: string, data: Calculation): Observable<Calculation> {
    return this.http.put<Calculation>(`${this.API_URL}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getComparison(): Observable<ComparisonData> {
    return this.http.get<ComparisonData>(`${this.API_URL}/compare`);
  }
}

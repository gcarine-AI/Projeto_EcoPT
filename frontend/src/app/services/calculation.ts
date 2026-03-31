import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Calculation, ComparisonData } from '../models/calculation.model';

@Injectable({
  providedIn: 'root',
})
export class CalculationService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/calculations';

  // 1. Criar um novo cálculo (POST)
  create(data: Calculation): Observable<Calculation> {
    return this.http.post<Calculation>(this.API_URL, data);
  }

  // 2. Listar todos os cálculos do utilizador (GET)
  // O Interceptor adiciona o Token, o Backend filtra pelo user_id
  list(): Observable<Calculation[]> {
    return this.http.get<Calculation[]>(this.API_URL);
  }

  // 3. Obter um cálculo específico para edição (GET)
  getById(id: string): Observable<Calculation> {
    return this.http.get<Calculation>(`${this.API_URL}/${id}`);
  }

  // 4. Atualizar um cálculo existente (PUT)
  update(id: string, data: Calculation): Observable<Calculation> {
    return this.http.put<Calculation>(`${this.API_URL}/${id}`, data);
  }

  // 5. Eliminar um cálculo (DELETE)
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  // 6. Obter dados para o Comparador (Média Europeia vs User)
  getComparison(): Observable<ComparisonData> {
    return this.http.get<ComparisonData>(`${this.API_URL}/compare`);
  }
}

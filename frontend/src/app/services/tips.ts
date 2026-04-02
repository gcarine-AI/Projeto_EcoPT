import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Tip {
  id: number;
  title: string;
  category: string;
  description: string;
  icon: string;
  impact_kg?: number;
}

@Injectable({ providedIn: 'root' })
export class TipsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tips`;

  getAll(): Observable<Tip[]> {
    return this.http.get<Tip[]>(this.apiUrl);
  }

  getByCategory(category: string): Observable<Tip[]> {
    return this.http.get<Tip[]>(`${this.apiUrl}/category/${category}`);
  }
}

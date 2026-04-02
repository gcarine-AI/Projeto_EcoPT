import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  source?: string;
}

@Injectable({ providedIn: 'root' })
export class FaqService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/faq`;

  getAll(): Observable<FaqItem[]> {
    return this.http.get<FaqItem[]>(this.apiUrl);
  }
}

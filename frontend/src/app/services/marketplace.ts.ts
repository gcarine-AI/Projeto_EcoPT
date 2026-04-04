import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MarketplaceItem {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  type: 'doacao' | 'troca' | 'venda' | 'emprestimo';
  price?: number;
  location?: string;
  status: 'disponivel' | 'reservado' | 'concluido';
  created_at: string;
  Profiles?: { name: string };
}

export interface CreateItem {
  title: string;
  description?: string;
  category: string;
  type: string;
  price?: number;
  location?: string;
}

@Injectable({ providedIn: 'root' })
export class MarketplaceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/marketplace`;

  getAll(category?: string, type?: string): Observable<MarketplaceItem[]> {
    let url = this.apiUrl;
    const params: string[] = [];
    if (category) params.push(`category=${category}`);
    if (type) params.push(`type=${type}`);
    if (params.length) url += `?${params.join('&')}`;
    return this.http.get<MarketplaceItem[]>(url);
  }

  getMyItems(): Observable<MarketplaceItem[]> {
    return this.http.get<MarketplaceItem[]>(`${this.apiUrl}/my-items`);
  }

  create(item: CreateItem): Observable<MarketplaceItem> {
    return this.http.post<MarketplaceItem>(this.apiUrl, item);
  }

  update(id: number, item: Partial<CreateItem>): Observable<MarketplaceItem> {
    return this.http.put<MarketplaceItem>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  interest(id: number): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/${id}/interest`, {});
  }
}

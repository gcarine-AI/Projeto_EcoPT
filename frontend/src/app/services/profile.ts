import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/profile`);
  }

  updateProfile(name: string): Observable<{ message: string; profile: Profile }> {
    return this.http.put<{ message: string; profile: Profile }>(`${this.apiUrl}/profile`, { name });
  }
}

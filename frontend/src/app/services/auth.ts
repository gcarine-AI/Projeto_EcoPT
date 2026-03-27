import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    role?: string;
  };
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  register(email: string, password: string, name: string, role: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, {
      email,
      password,
      name,
      role,
    });
  }

  login(email: string, password: string, role: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.user.role || role);
          localStorage.setItem('email', response.user.email);
          if (response.user.name) {
            localStorage.setItem('name', response.user.name);
          }
        }),
      );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  getName(): string | null {return localStorage.getItem('name');}
  getRole(): string | null { return localStorage.getItem('role'); }
  getEmail(): string | null { return localStorage.getItem('email'); }
  getToken(): string | null { return localStorage.getItem('token'); }
  isLoggedIn(): boolean {return !!localStorage.getItem('token');}
}

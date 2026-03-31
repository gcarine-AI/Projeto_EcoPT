import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable} from 'rxjs';
import { environment } from '../../environments/environment';
import { createClient, SupabaseClient} from '@supabase/supabase-js'

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
  private supabase: SupabaseClient;
  public token = ''

  constructor() {
    this.supabase = createClient(environment.apiUrl, environment.SUPABASE_ANON_KEY)
  }


  register(email: string, password: string, name: string, role: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, {
      email,
      password,
      name,
      role,
    });
  }
async login (email:string, password:string) {
  try {
  const {data, error} = await this.supabase.auth.signInWithPassword({ email, password})
  if (error) throw error
  this.token = data.session?.access_token || '';
      // Guardamos no localStorage para o Dashboard conseguir ler mesmo após refresh
      localStorage.setItem('token', this.token);
      localStorage.setItem('email', data.user?.email || '');
  return true}

  catch (error) {
    console.log(error)
    return false
  }
}


  async logout(){
    try {
      const {error} = await this.supabase.auth.signOut()
      if (error) throw error
      this.token = '';
      localStorage.clear();
      this.router.navigate(['/login']);
      return true}

    catch (error) {
      console.log(error)
      return false
    }
  }
  getName(): string | null {return localStorage.getItem('name');}
  getRole(): string | null { return localStorage.getItem('role'); }
  getEmail(): string | null { return localStorage.getItem('email'); }
  getToken(): string | null { return localStorage.getItem('token') || this.token; }
  isLoggedIn(): boolean {return !! this.getToken()}
}

import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  // Obtém o email guardado no localStorage através do serviço que corrigimos
  getUserEmail(): string | null {
    return this.authService.getEmail();
  }
  getUserName():string | null {
    return this.authService.getName();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Helper para não mostrar a navbar no Login e Register
  shouldShowNavbar(): boolean {
    const publicRoutes = ['/login', '/register'];
    return !publicRoutes.includes(this.router.url);
  }
}

import { Component, inject, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { AuthService } from './services/auth';
import { CommonModule } from '@angular/common';import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NavbarComponent,
    MatIconModule,
    MatMenuModule,
    MatButtonModule
  ],

  templateUrl: './app.html',
  styleUrl: './app.css',
})

  export class AppComponent {
    authService = inject(AuthService);
    isMobile: boolean = window.innerWidth < 850;

    @HostListener('window:resize')
    onResize() {
      this.isMobile = window.innerWidth < 850;
    }
  }


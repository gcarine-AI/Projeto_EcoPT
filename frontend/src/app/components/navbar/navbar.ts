import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { NotificationsService, Notification } from '../../services/notifications';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit{
  public authService = inject(AuthService);
  private router = inject(Router);
  private notificationsService = inject(NotificationsService);
  public notifications: Notification[] = [];
  public unreadCount = 0;

  ngOnInit(): void {
   if (this.authService.isLoggedIn()) {
    this.loadNotifications();
    // Verificar novas notificações a cada 30 segundos
    setInterval(() => {
      if (this.authService.isLoggedIn()) {
        this.loadNotifications();
      }
    }, 30000);
  }
}

  loadNotifications(): void {
    this.notificationsService.getAll().subscribe({
      next: (data) => {
        this.notifications = data;
        this.unreadCount = data.filter(n => !n.read).length;
      },
      error: () => console.error('Erro ao carregar notificações'),
    });
  }

  markAllRead(): void {
    this.notificationsService.markAllRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map(n => ({ ...n, read: true }));
        this.unreadCount = 0;
      },
    });
  }

  getUserEmail(): string | null {
    return this.authService.getEmail();
  }
  getUserName(): string | null {
    return this.authService.getName();
  }

  logout(): void {
    this.authService.logout();
  }

  shouldShowNavbar(): boolean {
    const publicRoutes = ['/login', '/register'];
    return !publicRoutes.includes(this.router.url);
  }
}

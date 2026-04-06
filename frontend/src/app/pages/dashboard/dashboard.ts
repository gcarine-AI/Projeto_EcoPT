import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Calculation } from '../../models/calculation.model';
import { CalculationService } from '../../services/calculation';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  private calcService = inject(CalculationService);
  private authService = inject(AuthService);

  public lastCalculation: Calculation | null = null;
  public readonly avgPortugal = 5.1; // Toneladas de CO2 por pessoa/ano em PT
  public percentage = 0;
  public statusMessage = 'A carregar dados...';
  public loading = true;
  public Math = Math;

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.fetchData();
    } else {
      this.statusMessage = 'Sessão expirada. Por favor, faz login novamente';
      this.loading = false;
    }
  }

  fetchData(): void {
    this.loading = true;

    this.calcService.list().subscribe({
      next: (data: Calculation[]) => {
        if (data && data.length > 0) {
          this.lastCalculation = data[0];
          this.calculateImpact();
        } else {
          this.statusMessage = 'Ainda não tens cálculos realizados.';
        }
        this.loading = false;
      },
      error: (err: Error) => {
        console.error(err);
        this.statusMessage = 'Erro ao ligar o servidor';
        this.loading = false;
      },
    });
  }

  calculateImpact(): void {
    if (this.lastCalculation?.total_co2) {
      const rawPercentage = (this.lastCalculation.total_co2 / 10) * 100;
      this.percentage = Math.min(rawPercentage, 100);
    }
  }

  getProgressBarColor(): 'primary' | 'warn' {
    if (!this.lastCalculation?.total_co2) return 'primary';
    return this.lastCalculation.total_co2 <= this.avgPortugal ? 'primary' : 'warn';
  }
}

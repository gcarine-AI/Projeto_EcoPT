import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

export interface Calculation {
  id: string;
  user_id: string;
  car_km: number;
  flights: number;
  diet: 'vegan' | 'vegetariana' | 'omnivora' | 'carnivora';
  kwh: number;
  total_co2: number;
  created_at: string;
}

// Interface para a resposta da comparação (se o teu backend enviar algo específico)
export interface ComparisonData {
  last_calculation: Calculation;
  average_pt: number;
  average_eu: number;
}
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
  private http = inject(HttpClient);

  lastCalculation: Calculation | null = null;
  readonly avgPortugal = 5.1; // Toneladas de CO2 por pessoa/ano em PT
  percentage = 0;
  statusMessage = 'A carregar dados...';

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    // Endpoint que criámos no TP1 para buscar o último cálculo
    this.http.get<Calculation[]>('http://localhost:3000/api/calculations').subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.lastCalculation = data[0]; // Assume que o mais recente vem primeiro
          this.calculateImpact();
        } else {
          this.statusMessage = 'Ainda não tens cálculos realizados.';
        }
      },
      error: () => (this.statusMessage = 'Erro ao ligar ao servidor.'),
    });
  }

  calculateImpact(): void {
    // Regra de três simples para a barra de progresso (máximo 10 toneladas para escala)
    if (this.lastCalculation) {
      // Limitar a 100% para a barra não transbordar visualmente
      const rawPercentage = (this.lastCalculation.total_co2 / 10) * 100;
      this.percentage = Math.min(rawPercentage, 100);
    }
  }

  getProgressBarColor(): 'primary' | 'warn' {
    if (!this.lastCalculation) return 'primary';
    return this.lastCalculation.total_co2 <= this.avgPortugal ? 'primary' : 'warn';
  }
}

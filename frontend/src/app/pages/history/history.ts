import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Calculation } from '../../models/calculation.model';
import { CalculationService } from '../../services/calculation';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatProgressBarModule, RouterLink],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class HistoryComponent implements OnInit {
  private calcService = inject(CalculationService);

  // Tipagem rigorosa: Array de Calculation
  public dataSource: Calculation[] = [];

  // Colunas que queremos mostrar na tabela
  public displayedColumns: string[] = ['created_at', 'total_co2', 'diet', 'actions'];
  public loading = false;

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.
      },
      error: () => alert('Erro ao carregar o histórico.')
    });
  }

  deleteCalculation(id: string): void {
    if (confirm('Tem a certeza que deseja eliminar este registo?')) {
      this.http.delete(`http://localhost:3000/api/calculations/${id}`).subscribe({
        next: () => {
          // Filtramos a lista localmente para atualizar a UI sem novo GET
          this.dataSource = this.dataSource.filter(item => item.id !== id);
        },
        error: () => alert('Erro ao eliminar.')
      });
    }
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Calculation } from '../../models/calculation.model';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, RouterLink],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class HistoryComponent implements OnInit {
  private http = inject(HttpClient);

  // Tipagem rigorosa: Array de Calculation
  dataSource: Calculation[] = [];

  // Colunas que queremos mostrar na tabela
  displayedColumns: string[] = ['created_at', 'total_co2', 'diet', 'actions'];

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.http.get<Calculation[]>('http://localhost:3000/calculations').subscribe({
      next: (data) => {
        this.dataSource = data;
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

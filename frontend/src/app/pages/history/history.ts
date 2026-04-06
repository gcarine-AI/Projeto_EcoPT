import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    RouterLink,
  ],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class HistoryComponent implements OnInit {
  private calcService = inject(CalculationService);

  public dataSource: Calculation[] = [];

  public displayedColumns: string[] = ['created_at', 'total_co2', 'diet', 'actions'];
  public loading = false;
  public totalCO2 = 0;
  public avgCO2 = 0;
  public Math = Math;

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.calcService.list().subscribe({
      next: (data: Calculation[]) => {
        this.dataSource = data;
        this.totalCO2 = data.reduce((sum, c) => sum + (c.total_co2 ?? 0), 0);
        this.avgCO2 = data.length > 0 ? this.totalCO2 / data.length : 0;
        this.loading = false;
      },
      error: (err: Error) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  deleteCalculation(id: string): void {
    if (confirm('Tem a certeza que deseja eliminar este registo?')) {
      this.loading = true;
      this.calcService.delete(id).subscribe({
        next: () => {
          this.dataSource = this.dataSource.filter((item) => item.id !== id);
          this.totalCO2 = this.dataSource.reduce((sum, c) => sum + (c.total_co2 ?? 0), 0);
          this.avgCO2 = this.dataSource.length > 0 ? this.totalCO2 / this.dataSource.length : 0;
          this.loading = false;
        },
        error: (err: Error) => {
          console.error(err);
          this.loading = false;
        },
      });
    }
  }
}

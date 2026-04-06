import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Calculation } from '../../models/calculation.model';
import { CalculationService } from '../../services/calculation';
import { Chart, registerables, ChartConfiguration } from 'chart.js';

Chart.register(...registerables);

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
  @ViewChild('evolutionChart', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  private calcService = inject(CalculationService);
  public dataSource: Calculation[] = [];
  public displayedColumns: string[] = ['created_at', 'total_co2', 'diet', 'actions'];
  public loading = false;
  public totalCO2 = 0;
  public avgCO2 = 0;
  public Math = Math;
  private chart: Chart | undefined;

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

        setTimeout(() => {
          this.updateChart();
        }, 0);
      },
      error: (err: Error) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  updateChart(): void {
    if (!this.chartCanvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const sortedData = [...this.dataSource].sort(
      (a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime(),
    );

    const labels = sortedData.map((d) => new Date(d.created_at!).toLocaleDateString());
    const values = sortedData.map((d) => d.total_co2 ?? 0);

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'kg CO2 por cálculo',
            data: values,
            borderColor: '#2e7d32',
            backgroundColor: 'rgba(46, 125, 50, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#2e7d32',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'kg CO2' },
          },
        },
      },
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, config);
  }

  deleteCalculation(id: string): void {
    if (confirm('Tem a certeza que deseja eliminar este registo?')) {
      this.loading = true;
      this.calcService.delete(id).subscribe({
        next: () => {
          this.dataSource = this.dataSource.filter((item) => item.id !== id);
          this.totalCO2 = this.dataSource.reduce((sum, c) => sum + (c.total_co2 ?? 0), 0);
          this.avgCO2 = this.dataSource.length > 0 ? this.totalCO2 / this.dataSource.length : 0;
          this.updateChart();
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

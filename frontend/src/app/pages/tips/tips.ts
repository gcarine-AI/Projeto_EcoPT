import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TipsService, Tip } from '../../services/tips';

@Component({
  selector: 'app-tips',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatIconModule, MatCardModule, MatProgressBarModule],
  templateUrl: './tips.html',
  styleUrl: './tips.css',
})
export class TipsComponent implements OnInit {
  private tipsService = inject(TipsService);
  public tips: Tip[] = [];
  public filteredTips: Tip[] = [];
  public activeCategory = 'all';
  public totalImpact = 0;
  public loading = false;

  ngOnInit(): void {
    this.loading = true;
    this.tipsService.getAll().subscribe({
      next: (data) => {
        this.tips = data;
        this.filteredTips = data;
        this.totalImpact = data.reduce((sum, t) => sum + (t.impact_kg ?? 0), 0);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  setCategory(category: string): void {
    this.activeCategory = category;
    this.filteredTips =
      category === 'all' ? this.tips : this.tips.filter((t) => t.category === category);
  }
}

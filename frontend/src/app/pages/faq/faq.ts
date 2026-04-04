import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FaqService, FaqItem } from '../../services/faq';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
  ],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class FAQComponent implements OnInit {
  private faqService = inject(FaqService);
  public faqs: FaqItem[] = [];
  public openId: number | null = null;
  public loading = false;

  toggle(id: number): void {
    this.openId = this.openId === id ? null : id;
  }

  ngOnInit(): void {
    this.loading = true;
    this.faqService.getAll().subscribe({
      next: (data) => {
        this.faqs = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }
}

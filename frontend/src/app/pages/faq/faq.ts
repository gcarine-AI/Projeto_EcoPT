import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
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
    MatDivider,
    MatProgressBarModule,
  ],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class FAQComponent implements OnInit {
  private faqService = inject(FaqService);
  public faqs: FaqItem[] = [];
  public loading = false;

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

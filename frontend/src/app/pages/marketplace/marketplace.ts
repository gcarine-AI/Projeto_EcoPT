import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MarketplaceService, MarketplaceItem } from '../../services/marketplace.ts';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatSnackBarModule],
  templateUrl: './marketplace.html',
  styleUrl: './marketplace.css',
})
export class MarketplaceComponent implements OnInit {
  private marketplaceService = inject(MarketplaceService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  public items: MarketplaceItem[] = [];
  public myItems: MarketplaceItem[] = [];
  public loading = false;
  public activeTab: 'browse' | 'publish' | 'mine' = 'browse';
  public activeCategory = 'all';
  public activeType = 'all';
  public currentUserId = localStorage.getItem('id');

  public itemForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    category: ['', Validators.required],
    type: ['', Validators.required],
    price: [null],
    location: [''],
  });

  public categories = [
    { value: 'all', label: 'Todos', icon: 'apps' },
    { value: 'alimentos', label: 'Alimentos', icon: 'restaurant' },
    { value: 'roupa', label: 'Roupa', icon: 'checkroom' },
    { value: 'moveis', label: 'Móveis', icon: 'chair' },
    { value: 'utensilios', label: 'Utensílios', icon: 'kitchen' },
    { value: 'ferramentas', label: 'Ferramentas', icon: 'build' },
    { value: 'outro', label: 'Outro', icon: 'category' },
  ];

  public types = [
    { value: 'all', label: 'Todos' },
    { value: 'doacao', label: 'Doação' },
    { value: 'troca', label: 'Troca' },
    { value: 'venda', label: 'Venda' },
    { value: 'emprestimo', label: 'Empréstimo' },
  ];

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    const cat = this.activeCategory === 'all' ? undefined : this.activeCategory;
    const type = this.activeType === 'all' ? undefined : this.activeType;
    this.marketplaceService.getAll(cat, type).subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadMyItems(): void {
    this.loading = true;
    this.marketplaceService.getMyItems().subscribe({
      next: (data) => {
        this.myItems = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  setTab(tab: 'browse' | 'publish' | 'mine'): void {
    this.activeTab = tab;
    if (tab === 'mine') this.loadMyItems();
  }

  setCategory(cat: string): void {
    this.activeCategory = cat;
    this.loadItems();
  }

  setType(type: string): void {
    this.activeType = type;
    this.loadItems();
  }

  publish(): void {
    if (this.itemForm.invalid) return;
    this.loading = true;
    this.marketplaceService.create(this.itemForm.value).subscribe({
      next: () => {
        this.snackBar.open('Item publicado com sucesso! 🌱', 'Fechar', { duration: 4000 });
        this.itemForm.reset();
        this.activeTab = 'browse';
        this.loadItems();
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(err.error?.error || 'Erro ao publicar', 'Fechar', { duration: 4000 });
        this.loading = false;
      },
    });
  }

  showInterest(id: number): void {
    this.marketplaceService.interest(id).subscribe({
      next: () => {
        this.snackBar.open('Interesse registado! O dono será contactado. 🤝', 'Fechar', {
          duration: 4000,
        });
        this.loadItems();
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(err.error?.error || 'Erro ao registar interesse', 'Fechar', {
          duration: 4000,
        });
      },
    });
  }

  deleteItem(id: number): void {
    if (!confirm('Tens a certeza que queres eliminar este item?')) return;
    this.marketplaceService.delete(id).subscribe({
      next: () => {
        this.myItems = this.myItems.filter((i) => i.id !== id);
        this.snackBar.open('Item eliminado.', 'Fechar', { duration: 3000 });
      },
    });
  }

  getTypeLabel(type: string): string {
    return this.types.find((t) => t.value === type)?.label || type;
  }

  getCategoryIcon(category: string): string {
    return this.categories.find((c) => c.value === category)?.icon || 'category';
  }

  get showPrice(): boolean {
    return this.itemForm.get('type')?.value === 'venda';
  }
}

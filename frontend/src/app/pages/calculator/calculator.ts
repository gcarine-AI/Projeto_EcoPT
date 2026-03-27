import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'; // Importar ActivatedRoute
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { Calculation } from './../dashboard/dashboard'; // Importar a interface

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatStepperModule,
    MatIconModule
  ],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css'
})
export class CalculatorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Injetar a rota ativa

  calcForm: FormGroup = this.fb.group({
    car_km: [0, [Validators.required, Validators.min(0)]],
    flights: [0, [Validators.required, Validators.min(0)]],
    diet: ['omnivora', Validators.required],
    kwh: [0, [Validators.required, Validators.min(0)]]
  });

  editId: string | null = null; // Guardar o ID se estivermos em modo edição

  ngOnInit(): void {
    // Verificar se existe um ID na URL (ex: /calculator/123)
    this.editId = this.route.snapshot.paramMap.get('id');

    if (this.editId) {
      this.loadCalculationData(this.editId);
    }
  }

  private loadCalculationData(id: string): void {
    this.http.get<Calculation>(`http://localhost:3000/api/calculations/${id}`).subscribe({
      next: (data) => {
        // patchValue preenche o formulário com os dados que vêm da API
        this.calcForm.patchValue(data);
      },
      error: () => alert('Erro ao carregar dados do cálculo.')
    });
  }

  submit(): void {
    if (this.calcForm.valid) {
      const url = 'http://localhost:3000/api/calculations';

      // Se tivermos editId, usamos PUT. Caso contrário, POST.
      const request$ = this.editId
        ? this.http.put(`${url}/${this.editId}`, this.calcForm.value)
        : this.http.post(url, this.calcForm.value);

      request$.subscribe({
        next: () => {
          alert(this.editId ? 'Cálculo atualizado!' : 'Cálculo guardado!');
          this.router.navigate(['/history']); // Redireciona para o histórico
        },
        error: () => alert('Erro ao processar o cálculo.')
      });
    }
  }
}


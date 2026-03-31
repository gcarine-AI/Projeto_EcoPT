import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // Importar ActivatedRoute
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Calculation } from '../../models/calculation.model'
import { CalculationService } from '../../services/calculation';

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
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css'
})
export class CalculatorComponent implements OnInit {
  private calcService = inject(CalculationService)
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Injetar a rota ativa

  public calcForm: FormGroup = this.fb.group({
    car_km: [0, [Validators.required, Validators.min(0)]],
    flights: [0, [Validators.required, Validators.min(0)]],
    diet: ['omnivora', Validators.required],
    kwh: [0, [Validators.required, Validators.min(0)]]
  });

  public editId: string | null = null;
  public loading = false;

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');

    if (this.editId) {
      this.loadCalculationData(this.editId);
    }
  }

  private loadCalculationData(id: string): void {
    this.loading = true;
    this.calcService.getById(id).subscribe({
      next: (data: Calculation) => {
        this.calcForm.patchValue(data);
        this.loading = false;
      },
      error: (err: Error) =>{
        console.error('Erro ao carregar dados: ', err);
        alert('Não foi possivel carregar o cálculo.');
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.calcForm.valid) {
      this.loading = true;
      const formData: Calculation = this.calcForm.value;

      const request$ = this.editId
        ? this.calcService.update(this.editId, formData)
        : this.calcService.create(formData);

      request$.subscribe({
        next: () => {
          alert(this.editId ? 'Cálculo atualizado! ☘️' : 'Pegada calculada com sucesso!!');
          this.router.navigate(['/history']); // Redireciona para o histórico
        },
        error: (err: Error) => {
          console.error ('Erro no servidor:', err);
          alert('Erro ao processar o cálculo.');
          this.loading = false;
        }
      });
    }
  }
}


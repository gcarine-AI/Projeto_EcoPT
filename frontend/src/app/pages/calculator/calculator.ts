import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports:
  [
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatCardModule,
  MatStepperModule,
  MatIconModule
],
  templateUrl: './calculator.html'
})
export class CalculatorComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  calcForm: FormGroup = this.fb.group({
    car_km: [0, [Validators.required, Validators.min(0)]],
    flights: [0, [Validators.required, Validators.min(0)]],
    diet: ['omnivora', Validators.required],
    kwh: [0, [Validators.required, Validators.min(0)]]
  });

  submit() {
    if (this.calcForm.valid) {
      // O Interceptor que criámos antes vai adicionar o Token automaticamente!
      this.http.post('http://localhost:3000/api/calculations', this.calcForm.value)
        .subscribe({
          next: () => {
            alert('Cálculo guardado com sucesso!');
            this.router.navigate(['/dashboard']);
          },
          error: () => alert('Erro ao guardar cálculo.')
        });
    }
  }
}

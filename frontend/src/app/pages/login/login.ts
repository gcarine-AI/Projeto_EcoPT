import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  error = '';
  isLoading = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  

  async loginAs() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = '';

    const { email, password } = this.loginForm.value;

    const login = await this.authService.login(email, password)
    console.log(login)

    try {
      const login = await this.authService.login(email, password)
      if (!login) throw Error
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.log(error)
        this.isLoading = false;
        this.error = 'Credenciais inválidas ou utilizador não registado.';
    }

    /* this.authService.login(email, password, role).({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Email ou password incorretos. Tenta novamente.';
      },
    }); */
  }
}

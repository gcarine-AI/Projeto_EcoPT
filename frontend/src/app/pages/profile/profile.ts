import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { ProfileService, Profile } from '../../services/profile';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressBarModule,
    RouterLink,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  public profile: Profile | null = null;
  public loading = false;
  public editing = false;

  public profileForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.profileForm.patchValue({ name: data.name });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  save(): void {
    if (this.profileForm.invalid) return;
    this.loading = true;
    this.profileService.updateProfile(this.profileForm.value.name).subscribe({
      next: (res) => {
        this.profile = res.profile;
        localStorage.setItem('name', res.profile.name);
        this.editing = false;
        this.loading = false;
        this.snackBar.open('Perfil atualizado! ✅', 'Fechar', { duration: 3000 });
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Erro ao atualizar perfil', 'Fechar', { duration: 3000 });
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }

  getRoleLabel(role: string): string {
    return role === 'company' ? 'Empresa' : 'Pessoal';
  }
}

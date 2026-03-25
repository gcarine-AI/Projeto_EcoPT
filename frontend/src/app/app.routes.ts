import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { CalculatorComponent } from './pages/calculator/calculator';
import { HistoryComponent } from './pages/history/history';
import { TipsComponent } from './pages/tips/tips';
import { CarsharingComponent } from './pages/carsharing/carsharing';
import { FaqComponent } from './pages/faq/faq';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'calculator',
    component: CalculatorComponent,
    canActivate: [authGuard]
  },
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [authGuard]
  },
  {
    path: 'tips',
    component: TipsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'carsharing',
    component: CarsharingComponent,
    canActivate: [authGuard]
  },
  {
    path: 'faq',
    component: FaqComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];

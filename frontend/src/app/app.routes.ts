import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { CalculatorComponent } from './pages/calculator/calculator';
import { HistoryComponent } from './pages/history/history';
import { TipsComponent } from './pages/tips/tips';
import { CarsharingComponent } from './pages/carsharing/carsharing';
import { FAQComponent } from './pages/faq/faq';
import { MarketplaceComponent } from './pages/marketplace/marketplace';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'calculator',
    component: CalculatorComponent,
  },
  {
    path: 'calculator/:id',
    component: CalculatorComponent,
  },
  {
    path: 'history',
    component: HistoryComponent,
  },
  {
    path: 'tips',
    component: TipsComponent,
  },
  {
    path: 'carsharing',
    component: CarsharingComponent,
  },
  {
    path: 'faq',
    component: FAQComponent,
  },
  {
    path: 'marketplace',
    component: MarketplaceComponent,
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then((m) => m.ProfileComponent),
  },

  { path: '**', redirectTo: '/login' },
];

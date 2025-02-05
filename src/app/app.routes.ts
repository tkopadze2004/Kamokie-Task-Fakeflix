import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./pages/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'browse',
    component: BrowseComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'auth' },
];

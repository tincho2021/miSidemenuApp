import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // 1) Cuando entres a la raíz, ve a login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // 2) Login (sin guardia)
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },

  // 3) Rutas protegidas por AuthGuard
  {
    path: 'tanques',
    loadComponent: () => import('./tanques/tanques.page').then(m => m.TanquesPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'historial',
    loadComponent: () => import('./historial/historial.page').then(m => m.HistorialPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'alarmas',
    loadComponent: () => import('./alarmas/alarmas.page').then(m => m.AlarmasPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'descargas',
    loadComponent: () => import('./descargas/descargas.page').then(m => m.DescargasPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'mapa',
    loadComponent: () => import('./mapa/mapa.page').then(m => m.MapaPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'soporte',
    loadComponent: () => import('./soporte/soporte.page').then(m => m.SoportePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./configuracion/configuracion.page').then(m => m.ConfiguracionPage),
    canActivate: [AuthGuard]
  },

  // 4) Cualquier otra ruta desconocida, vuelve a login
  {
    path: '**',
    redirectTo: 'login'
  }
];

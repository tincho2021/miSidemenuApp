import { Routes } from '@angular/router';

// Importa cada página standalone
import { TanquesPage } from './tanques/tanques.page';
import { HistorialPage } from './historial/historial.page';
import { AlarmasPage } from './alarmas/alarmas.page';
import { DescargasPage } from './descargas/descargas.page';
import { MapaPage } from './mapa/mapa.page';
import { SoportePage } from './soporte/soporte.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tanques',
    pathMatch: 'full'
  },
  {
    path: 'tanques',
    loadComponent: () => import('./tanques/tanques.page').then(m => m.TanquesPage)
  },
  {
    path: 'historial',
    loadComponent: () => import('./historial/historial.page').then(m => m.HistorialPage)
  },
  {
    path: 'alarmas',
    loadComponent: () => import('./alarmas/alarmas.page').then(m => m.AlarmasPage)
  },
  {
    path: 'descargas',
    loadComponent: () => import('./descargas/descargas.page').then(m => m.DescargasPage)
  },
  {
    path: 'mapa',
    loadComponent: () => import('./mapa/mapa.page').then(m => m.MapaPage)
  },
  {
    path: 'soporte',
    loadComponent: () => import('./soporte/soporte.page').then(m => m.SoportePage)
  }
];

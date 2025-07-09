import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonNote,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonHeader,
  IonToolbar,
  IonTitle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cubeSharp,
  timeSharp,
  alertSharp,
  downloadSharp,
  mapSharp,
  helpCircleSharp,
  settingsSharp
} from 'ionicons/icons';

// Registrar iconos usados en el menú
addIcons({
  'cube-sharp': cubeSharp,
  'time-sharp': timeSharp,
  'alert-sharp': alertSharp,
  'download-sharp': downloadSharp,
  'map-sharp': mapSharp,
  'help-circle-sharp': helpCircleSharp,
  'settings-sharp': settingsSharp
});

const TITULOS_RUTAS: { [key: string]: string } = {
  '/tanques': 'Tanques',
  '/historial': 'Historial',
  '/alarmas': 'Alarmas',
  '/descargas': 'Descargas',
  '/mapa': 'Mapa',
  '/soporte': 'Soporte'
};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterOutlet
  ]
})
export class AppComponent {
  public appPages = [
    { title: 'Tanques', url: '/tanques', icon: 'cube' },
    { title: 'Historial', url: '/historial', icon: 'time' },
    { title: 'Alarmas', url: '/alarmas', icon: 'alert' },
    { title: 'Descargas', url: '/descargas', icon: 'download' },
    { title: 'Mapa', url: '/mapa', icon: 'map' },
    { title: 'Soporte', url: '/soporte', icon: 'help-circle' }
  ];

  public tituloPagina: string = 'Telemedición';
  public isLoginPage = false;

  constructor(private router: Router, private titleService: Title) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const ruta = event.urlAfterRedirects;
        // Título de la pestaña
        this.tituloPagina = TITULOS_RUTAS[ruta] || 'Telemedición';
        this.titleService.setTitle(this.tituloPagina);
        // Detectar página de login
        this.isLoginPage = ruta === '/login';
      }
    });
  }
}

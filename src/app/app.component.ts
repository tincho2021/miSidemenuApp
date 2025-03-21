import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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
  IonTitle,
  IonMenuButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cubeSharp, timeSharp, alertSharp, settingsSharp } from 'ionicons/icons';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Registrar iconos usados en el menú
addIcons({
  'cube-sharp': cubeSharp,
  'time-sharp': timeSharp,
  'alert-sharp': alertSharp,
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
    RouterLink,
    RouterLinkActive,  // Asegura que están importados
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
    IonTitle,
    IonMenuButton
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

  constructor(private router: Router, private titleService: Title) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const rutaActual = event.urlAfterRedirects;
        this.tituloPagina = TITULOS_RUTAS[rutaActual] || 'Telemedición';
        this.titleService.setTitle(this.tituloPagina);
      }
    });
  }
}

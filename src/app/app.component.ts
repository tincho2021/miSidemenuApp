import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  IonRouterLink,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonMenuButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cubeSharp, timeSharp, alertSharp, settingsSharp } from 'ionicons/icons';

// Registrar iconos usados en el menú
addIcons({
  'cube-sharp': cubeSharp,
  'time-sharp': timeSharp,
  'alert-sharp': alertSharp,
  'settings-sharp': settingsSharp  // Asegúrate de registrar este ícono
});

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
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
    IonRouterLink,
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

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor() {
    // Aquí puedes agregar iconos adicionales si lo requieres.
    addIcons({
      // Ejemplo: agregar otros iconos...
    });
  }
}
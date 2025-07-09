import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterModule
  ],
  template: `
    <ion-split-pane contentId="main">
      <ion-menu menuId="first" contentId="main">
        <ion-header>
          <ion-toolbar><ion-title>Menu</ion-title></ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-menu-toggle auto-hide="false" *ngFor="let p of pages">
              <ion-item [routerLink]="p.url" routerDirection="root">
                <ion-icon slot="start" [name]="p.icon + '-sharp'"></ion-icon>
                <ion-label>{{p.title}}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main"></ion-router-outlet>
    </ion-split-pane>
  `
})
export class AppShellComponent {
  pages = [
    { title: 'Tanques',    url: '/tanques',    icon: 'cube' },
    { title: 'Historial',  url: '/historial',  icon: 'time' },
    { title: 'Alarmas',    url: '/alarmas',    icon: 'alert' },
    { title: 'Descargas',  url: '/descargas',  icon: 'download' },
    { title: 'Mapa',       url: '/mapa',       icon: 'map' },
    { title: 'Soporte',    url: '/soporte',    icon: 'help-circle' }
  ];
}

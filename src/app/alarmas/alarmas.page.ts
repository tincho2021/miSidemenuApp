import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-alarmas',
  templateUrl: './alarmas.page.html',
  styleUrls: ['./alarmas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})
export class AlarmasPage implements OnInit {
  alarmas: any[] = [];
  thingSpeakChannelId = '2774824'; // ID del canal de alarmas
  thingSpeakApiKey = 'VMLCH1QI8KKX1LCJ'; // API Key de solo lectura

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarAlarmas();
  }

  cargarAlarmas() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 2); // Últimos 2 días
    const formattedStartDate = startDate.toISOString().split('T')[0];

    const url = `https://api.thingspeak.com/channels/${this.thingSpeakChannelId}/feeds.json?api_key=${this.thingSpeakApiKey}&start=${formattedStartDate}`;

    this.http.get<any>(url).subscribe(response => {
      if (response.feeds && response.feeds.length > 0) {
        const alarmasMap: { [key: string]: any } = {}; // Para almacenar la última alarma de cada tanque

        response.feeds.forEach((feed: any) => {
          for (let i = 1; i <= 8; i++) {
            if (feed[`field${i}`]) { // Si el campo tiene valor
              alarmasMap[`tanque${i}`] = { 
                fecha: feed.created_at, 
                mensaje: feed[`field${i}`],
                tanque: `Tanque ${i}`
              };
            }
          }
        });

        // Convertimos el objeto en un array para mostrarlo en el *ngFor
        this.alarmas = Object.keys(alarmasMap).map(key => ({
          tanque: alarmasMap[key].tanque,
          fecha: alarmasMap[key].fecha,
          mensaje: alarmasMap[key].mensaje
        }));
      }
    }, error => {
      console.error('Error al obtener las alarmas:', error);
    });
  }
}

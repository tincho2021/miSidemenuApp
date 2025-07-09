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
  thingSpeakChannelId = '3004323'; // ID del canal de alarmas
  thingSpeakApiKey = 'QW0YYQGH7P4Q9W5W'; // API Key de solo lectura

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarAlarmas();
  }

  cargarAlarmas() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 2); // Últimos 2 días
    const formattedStartDate = startDate.toISOString().split('T')[0];

    // Pedimos más de 1 feed para procesar alarmas antiguas y nuevas
    const url = `https://api.thingspeak.com/channels/${this.thingSpeakChannelId}/feeds.json?api_key=${this.thingSpeakApiKey}&start=${formattedStartDate}&results=100`;

    this.http.get<any>(url).subscribe(response => {
      if (response.feeds && response.feeds.length > 0) {
        // Ordenamos los feeds por fecha ASCENDENTE (viejo -> nuevo)
        const feedsSorted = response.feeds.sort((a: any, b: any) => {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });

        // Estructura para guardar la última alarma de cada tanque
        const alarmasMap: { [key: string]: any } = {};

        // Recorremos los feeds en orden
        feedsSorted.forEach((feed: any) => {
          for (let i = 1; i <= 8; i++) {
            const campo = `field${i}`;
            const valorCampo = feed[campo] ? feed[campo].trim() : '';
            const fechaFeed = feed.created_at;

            if (valorCampo !== '') {
              // Si hay texto, guardamos/actualizamos la alarma
              alarmasMap[`tanque${i}`] = {
                fecha: fechaFeed,
                mensaje: valorCampo,
                tanque: `Sensor ${i}`
              };
            } else {
              // Si el campo está vacío, BORRAMOS la alarma previa (si existe) 
              // solo si este feed es más reciente
              if (alarmasMap[`tanque${i}`]) {
                const fechaGuardada = new Date(alarmasMap[`tanque${i}`].fecha);
                const fechaActual = new Date(fechaFeed);
                if (fechaActual.getTime() > fechaGuardada.getTime()) {
                  // Borramos la alarma previa
                  delete alarmasMap[`tanque${i}`];
                }
              }
            }
          }
        });

        // Finalmente convertimos alarmasMap en array
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

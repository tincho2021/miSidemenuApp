import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HistorialPage {
  links: { title: string, url: SafeResourceUrl }[];

  constructor(private sanitizer: DomSanitizer) {
    const tanques = [
      { name: "Tanque 1", producto: "Nafta Super", field: 1 },
      { name: "Tanque 2", producto: "V Power Nafta", field: 2 },
      { name: "Tanque 3", producto: "V Power Diesel", field: 3 },
      { name: "Tanque 4", producto: "Diesel 500", field: 4 },
      { name: "Tanque 5", producto: "Nafta Super", field: 5 },
      { name: "Tanque 6", producto: "V Power Nafta", field: 6 },
      { name: "Tanque 7", producto: "V Power Diesel", field: 7 },
      { name: "Tanque 8", producto: "Diesel 500", field: 8 }
    ];

    // Aplicamos el nuevo tamaño con 10% de aumento total
    this.links = tanques.map(tanque => ({
      title: `${tanque.name} - ${tanque.producto}`,
      url: this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://thingspeak.mathworks.com/channels/2729529/charts/${tanque.field}?bgcolor=%23ffffff&color=%23d62020&days=2&dynamic=true&results=2000&type=line&width=386&height=276&xaxis=Fecha+%2FHora&yaxis=Volumen`
      )
    }));
  }
}

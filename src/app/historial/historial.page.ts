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
  links: SafeResourceUrl[];

  constructor(private sanitizer: DomSanitizer) {
    // Reemplaza o agrega los 8 enlaces reales que deseas usar
    const rawLinks = [
      'https://thingspeak.mathworks.com/channels/2729529/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15',
      'https://thingspeak.mathworks.com/channels/2729529/charts/2?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15',
      'https://thingspeak.mathworks.com/channels/2729529/charts/3?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15',
      'https://thingspeak.mathworks.com/channels/2729529/charts/4?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15',
      'https://thingspeak.mathworks.com/channels/2729529/charts/5?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15',
      'https://thingspeak.mathworks.com/channels/2729529/charts/6?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15',
      'https://thingspeak.mathworks.com/channels/2729529/charts/7?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15',
      'https://thingspeak.mathworks.com/channels/2729529/charts/8?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15'
    ];
    this.links = rawLinks.map(link => this.sanitizer.bypassSecurityTrustResourceUrl(link));
  }
}

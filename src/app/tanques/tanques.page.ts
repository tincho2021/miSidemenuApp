import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tanques',
  templateUrl: './tanques.page.html',
  styleUrls: ['./tanques.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule]
})
export class TanquesPage implements OnInit, AfterViewInit {

  // Datos fijos de respaldo para 8 tanques.  
  // Se actualizarán "height" y "volume" con los datos reales de ThingSpeak.
  gaugesData = [
    { fill: 0.2, colorStart: '#ff9999', colorEnd: '#cc0000', volume: 0, missing: 13586, height: 1067, battery: 90, lastUpdate: '17/02 13:24' },
    { fill: 0.4, colorStart: '#ffc299', colorEnd: '#cc6600', volume: 0, missing: 8400, height: 1055, battery: 62, lastUpdate: '17/02 13:23' },
    { fill: 0.6, colorStart: '#ffff99', colorEnd: '#cccc00', volume: 0, missing: 18000, height: 1444, battery: 85, lastUpdate: '17/02 13:28' },
    { fill: 0.8, colorStart: '#99ff99', colorEnd: '#00cc00', volume: 0, missing: 2000, height: 1200, battery: 80, lastUpdate: '17/02 13:24' },
    { fill: 0.3, colorStart: '#99ffff', colorEnd: '#00cccc', volume: 0, missing: 4000, height: 800, battery: 70, lastUpdate: '17/02 13:20' },
    { fill: 0.7, colorStart: '#9999ff', colorEnd: '#0000cc', volume: 0, missing: 9000, height: 950, battery: 65, lastUpdate: '17/02 13:22' },
    { fill: 0.5, colorStart: '#ff99ff', colorEnd: '#cc00cc', volume: 0, missing: 12000, height: 700, battery: 75, lastUpdate: '17/02 13:25' },
    { fill: 1.0, colorStart: '#ff6666', colorEnd: '#cc0000', volume: 0, missing: 0, height: 1500, battery: 95, lastUpdate: '17/02 13:24' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Actualiza alturas (y recalc fill) desde el canal de alturas (2729087)
    this.loadTankHeightsFromThingSpeak();
    // Actualiza volumen desde el canal de volumenes (2729529)
    this.loadTankVolumesFromThingSpeak();
  }

  ngAfterViewInit() {
    this.drawGauge();
  }

  // Función para cargar las alturas desde el canal 2729087
  private loadTankHeightsFromThingSpeak() {
    const heightUrl = 'https://api.thingspeak.com/channels/2729087/feeds.json?api_key=GH1L0B0S7GZAFAU&results=1';
    this.http.get<any>(heightUrl).subscribe(response => {
      if (response.feeds && response.feeds.length > 0) {
        const feed = response.feeds[0];
        // Asignar cada field al tanque correspondiente (field1 -> tanque 1, etc.)
        this.gaugesData[0].height = parseFloat(feed.field1) || this.gaugesData[0].height;
        this.gaugesData[1].height = parseFloat(feed.field2) || this.gaugesData[1].height;
        this.gaugesData[2].height = parseFloat(feed.field3) || this.gaugesData[2].height;
        this.gaugesData[3].height = parseFloat(feed.field4) || this.gaugesData[3].height;
        this.gaugesData[4].height = parseFloat(feed.field5) || this.gaugesData[4].height;
        this.gaugesData[5].height = parseFloat(feed.field6) || this.gaugesData[5].height;
        this.gaugesData[6].height = parseFloat(feed.field7) || this.gaugesData[6].height;
        this.gaugesData[7].height = parseFloat(feed.field8) || this.gaugesData[7].height;

        // Recalcular 'fill' en función de la altura real (por ejemplo, maxHeight = 2000 mm)
        const maxHeight = 2000;
        this.gaugesData.forEach(tank => {
          tank.fill = tank.height / maxHeight;
          if (tank.fill > 1) tank.fill = 1;
          if (tank.fill < 0) tank.fill = 0;
        });
        // Redibujar los widgets con la nueva información
        this.drawGauge();
      }
    }, error => {
      console.error('Error al cargar alturas:', error);
    });
  }

  // Función para cargar los volúmenes desde el canal 2729529
  private loadTankVolumesFromThingSpeak() {
    const volumeUrl = 'https://api.thingspeak.com/channels/2729529/feeds.json?api_key=GH1L0B0S7GZAFAU&results=1';
    this.http.get<any>(volumeUrl).subscribe(response => {
      if (response.feeds && response.feeds.length > 0) {
        const feed = response.feeds[0];
        // Asignar cada field al volumen correspondiente (field1 -> tanque 1, etc.)
        this.gaugesData[0].volume = parseFloat(feed.field1) || this.gaugesData[0].volume;
        this.gaugesData[1].volume = parseFloat(feed.field2) || this.gaugesData[1].volume;
        this.gaugesData[2].volume = parseFloat(feed.field3) || this.gaugesData[2].volume;
        this.gaugesData[3].volume = parseFloat(feed.field4) || this.gaugesData[3].volume;
        this.gaugesData[4].volume = parseFloat(feed.field5) || this.gaugesData[4].volume;
        this.gaugesData[5].volume = parseFloat(feed.field6) || this.gaugesData[5].volume;
        this.gaugesData[6].volume = parseFloat(feed.field7) || this.gaugesData[6].volume;
        this.gaugesData[7].volume = parseFloat(feed.field8) || this.gaugesData[7].volume;
        // Nota: El volumen no afecta el widget, solo se muestra en la tabla.
      }
    }, error => {
      console.error('Error al cargar volúmenes:', error);
    });
  }

  private drawGauge() {
    const canvases = document.querySelectorAll('canvas');
    if (!canvases || canvases.length === 0) {
      console.error('No se encontraron canvas');
      return;
    }

    canvases.forEach((canvas: HTMLCanvasElement, index: number) => {
      canvas.width = 220;
      canvas.height = 220;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('No se pudo obtener el contexto 2D');
        return;
      }

      // Limpia el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 10;

      const gauge = this.gaugesData[index];

      // 1) Fondo radial (pseudo-3D)
      const bgGradient = ctx.createRadialGradient(
        centerX, centerY, radius * 0.1,
        centerX, centerY, radius
      );
      bgGradient.addColorStop(0, '#f5f5f5');
      bgGradient.addColorStop(1, '#aaaaaa');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = bgGradient;
      ctx.fill();

      // 2) Dibujar el "líquido" según el porcentaje de llenado (fill)
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();

      const fillHeight = radius * 2 * gauge.fill;
      const fillY = centerY + radius - fillHeight;

      const fillGradient = ctx.createLinearGradient(
        0, centerY + radius,
        0, centerY - radius
      );
      fillGradient.addColorStop(0, gauge.colorStart);
      fillGradient.addColorStop(1, gauge.colorEnd);

      ctx.fillStyle = fillGradient;
      ctx.fillRect(centerX - radius, fillY, radius * 2, fillHeight);
      ctx.restore();

      // 3) Borde del círculo
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    });
  }
}

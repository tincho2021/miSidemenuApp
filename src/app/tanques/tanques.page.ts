import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

interface GaugeData {
  fill: number;
  colorStart: string;
  colorEnd: string;
  volume: number;
  missing: number;
  height: number;
  battery: number;
  lastUpdate: string;
  activo: boolean;
  tanque: number;      // Número del tanque
  producto: string;    // Nombre del producto
}

@Component({
  selector: 'app-tanques',
  templateUrl: './tanques.page.html',
  styleUrls: ['./tanques.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule]
})
export class TanquesPage implements OnInit, AfterViewInit {

  // Datos fijos de respaldo para 8 tanques.
  // Se actualizarán "height" y "volume" con los datos reales de ThingSpeak,
  // y luego se aplicará la configuración (color, altura máxima, volumen máximo, etc.)
  gaugesData: GaugeData[] = [
    { fill: 0.2, colorStart: '#ff9999', colorEnd: '#cc0000', volume: 7741, missing: 13586, height: 1067, battery: 90, lastUpdate: '17/02 13:24', activo: true, tanque: 1, producto: "" },
    { fill: 0.4, colorStart: '#ffc299', colorEnd: '#cc6600', volume: 1600, missing: 8400, height: 1055, battery: 62, lastUpdate: '17/02 13:23', activo: true, tanque: 2, producto: "" },
    { fill: 0.6, colorStart: '#ffff99', colorEnd: '#cccc00', volume: 9979, missing: 18000, height: 1444, battery: 85, lastUpdate: '17/02 13:28', activo: true, tanque: 3, producto: "" },
    { fill: 0.8, colorStart: '#99ff99', colorEnd: '#00cc00', volume: 9500, missing: 2000, height: 1200, battery: 80, lastUpdate: '17/02 13:24', activo: true, tanque: 4, producto: "" },
    { fill: 0.3, colorStart: '#99ffff', colorEnd: '#00cccc', volume: 6000, missing: 4000, height: 800, battery: 70, lastUpdate: '17/02 13:20', activo: true, tanque: 5, producto: "" },
    { fill: 0.7, colorStart: '#9999ff', colorEnd: '#0000cc', volume: 5000, missing: 9000, height: 950, battery: 65, lastUpdate: '17/02 13:22', activo: true, tanque: 6, producto: "" },
    { fill: 0.5, colorStart: '#ff99ff', colorEnd: '#cc00cc', volume: 3000, missing: 12000, height: 700, battery: 75, lastUpdate: '17/02 13:25', activo: true, tanque: 7, producto: "" },
    { fill: 1.0, colorStart: '#ff6666', colorEnd: '#cc0000', volume: 9999, missing: 0, height: 1500, battery: 95, lastUpdate: '17/02 13:24', activo: true, tanque: 8, producto: "" }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Actualiza alturas (del canal 2729087)
    this.loadTankHeightsFromThingSpeak();
    // Actualiza volúmenes (del canal 2729529)
    this.loadTankVolumesFromThingSpeak();
    // Aplica la configuración local (guardada en localStorage) para cada tanque
    this.aplicarConfiguracionLocal();
  }

  ngAfterViewInit() {
    this.drawGauge();
  }

  // Carga alturas desde el canal 2729087
  private loadTankHeightsFromThingSpeak() {
    const heightUrl = 'https://api.thingspeak.com/channels/2729087/feeds.json?api_key=GH1L0B0S7GZAFAU&results=1';
    this.http.get<any>(heightUrl).subscribe(response => {
      if (response.feeds && response.feeds.length > 0) {
        const feed = response.feeds[0];
        this.gaugesData[0].height = parseFloat(feed.field1) || this.gaugesData[0].height;
        this.gaugesData[1].height = parseFloat(feed.field2) || this.gaugesData[1].height;
        this.gaugesData[2].height = parseFloat(feed.field3) || this.gaugesData[2].height;
        this.gaugesData[3].height = parseFloat(feed.field4) || this.gaugesData[3].height;
        this.gaugesData[4].height = parseFloat(feed.field5) || this.gaugesData[4].height;
        this.gaugesData[5].height = parseFloat(feed.field6) || this.gaugesData[5].height;
        this.gaugesData[6].height = parseFloat(feed.field7) || this.gaugesData[6].height;
        this.gaugesData[7].height = parseFloat(feed.field8) || this.gaugesData[7].height;

        // Recalcular 'fill' usando altura máxima predeterminada (se ajustará con configuración local)
        const maxDefault = 2000;
        this.gaugesData.forEach(tank => {
          tank.fill = tank.height / maxDefault;
          if (tank.fill > 1) tank.fill = 1;
          if (tank.fill < 0) tank.fill = 0;
        });
        this.drawGauge();
      }
    }, error => {
      console.error('Error al cargar alturas:', error);
    });
  }

  // Carga volúmenes desde el canal 2729529
  private loadTankVolumesFromThingSpeak() {
    const volumeUrl = 'https://api.thingspeak.com/channels/2729529/feeds.json?api_key=GH1L0B0S7GZAFAU&results=1';
    this.http.get<any>(volumeUrl).subscribe(response => {
      if (response.feeds && response.feeds.length > 0) {
        const feed = response.feeds[0];
        this.gaugesData[0].volume = parseFloat(feed.field1) || this.gaugesData[0].volume;
        this.gaugesData[1].volume = parseFloat(feed.field2) || this.gaugesData[1].volume;
        this.gaugesData[2].volume = parseFloat(feed.field3) || this.gaugesData[2].volume;
        this.gaugesData[3].volume = parseFloat(feed.field4) || this.gaugesData[3].volume;
        this.gaugesData[4].volume = parseFloat(feed.field5) || this.gaugesData[4].volume;
        this.gaugesData[5].volume = parseFloat(feed.field6) || this.gaugesData[5].volume;
        this.gaugesData[6].volume = parseFloat(feed.field7) || this.gaugesData[6].volume;
        this.gaugesData[7].volume = parseFloat(feed.field8) || this.gaugesData[7].volume;
        // El volumen se mostrará en la tabla.
      }
    }, error => {
      console.error('Error al cargar volúmenes:', error);
    });
  }

  // Aplica la configuración guardada en localStorage (por tanque)
  private aplicarConfiguracionLocal() {
    const configStr = localStorage.getItem('tankConfigs');
    if (configStr) {
      const configs = JSON.parse(configStr);
      this.gaugesData.forEach((gauge, index) => {
        if (configs[index]) {
          const config = configs[index];
          // Se espera que config tenga: tanque, alturaMaxima, volumenMaximo, color, producto, activo
          gauge.tanque = config.tanque || (index + 1);
          gauge.producto = config.producto || "";
          gauge.activo = config.activo; // Booleano
          // Actualiza el color del widget según la configuración
          gauge.colorStart = config.color;
          gauge.colorEnd = config.color;
          // Recalcular 'fill' usando la altura máxima configurada para este tanque
          const maxAltura = config.alturaMaxima;
          gauge.fill = gauge.height / maxAltura;
          if (gauge.fill > 1) { gauge.fill = 1; }
          if (gauge.fill < 0) { gauge.fill = 0; }
          // Calcular el faltante basado en el volumen máximo configurado
          gauge.missing = config.volumenMaximo - gauge.volume;
        }
      });
      this.drawGauge();
    } else {
      console.log("No hay configuraciones guardadas en localStorage.");
    }
  }

  // Dibuja el widget de cada tanque (canvas)
  private phase: number = 0; // Declarada como propiedad de la clase

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
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 10;
      const gauge = this.gaugesData[index];
  
      // Fondo radial para efecto pseudo-3D
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
  
      // Clip del círculo
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
  
      // Calcular la altura base del líquido
      const fillHeight = radius * 2 * gauge.fill;
      const baseFillY = centerY + radius - fillHeight;
  
      // Parámetros de la onda
      const amplitude = 3;       // Amplitud reducida para onda sutil
      const waveFrequency = 0.1; // Frecuencia menor
  
      // Reducir la velocidad de animación: disminuimos el incremento de fase
      this.phase += 0.01; // Antes era 0.05, ahora se incrementa más despacio
  
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY + radius);
      for (let x = -radius; x <= radius; x++) {
        const waveY = baseFillY + amplitude * Math.sin(x * waveFrequency + this.phase);
        ctx.lineTo(centerX + x, waveY);
      }
      ctx.lineTo(centerX + radius, centerY + radius);
      ctx.lineTo(centerX - radius, centerY + radius);
      ctx.closePath();
  
      const fillGradient = ctx.createLinearGradient(
        0, centerY + radius,
        0, centerY - radius
      );
      fillGradient.addColorStop(0, gauge.colorStart);
      fillGradient.addColorStop(1, gauge.colorEnd);
  
      ctx.fillStyle = fillGradient;
      ctx.fill();
      ctx.restore();
  
      // Borde del círculo
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    });
  
    // Solicitar el siguiente cuadro de animación
    requestAnimationFrame(() => this.drawGauge());
  }
  
  
}

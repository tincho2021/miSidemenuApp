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
  tanque: number;
  producto: string;
}

@Component({
  selector: 'app-tanques',
  templateUrl: './tanques.page.html',
  styleUrls: ['./tanques.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule]
})
export class TanquesPage implements OnInit, AfterViewInit {

  // Configuración inicial de los tanques (se actualizará con datos reales)
  gaugesData: GaugeData[] = [
    { fill: 0, colorStart: '#ff9999', colorEnd: '#cc0000', volume: 0, missing: 9999, height: 0, battery: 0, lastUpdate: '', activo: true, tanque: 1, producto: '' },
    { fill: 0, colorStart: '#ffc299', colorEnd: '#cc6600', volume: 0, missing: 9999, height: 0, battery: 0, lastUpdate: '', activo: true, tanque: 2, producto: '' },
    { fill: 0, colorStart: '#ffff99', colorEnd: '#cccc00', volume: 0, missing: 9999, height: 0, battery: 0, lastUpdate: '', activo: true, tanque: 3, producto: '' },
    { fill: 0, colorStart: '#99ff99', colorEnd: '#00cc00', volume: 0, missing: 9999, height: 0, battery: 0, lastUpdate: '', activo: true, tanque: 4, producto: '' },
    { fill: 0, colorStart: '#99ffff', colorEnd: '#00cccc', volume: 0, missing: 9999, height: 0, battery: 0, lastUpdate: '', activo: true, tanque: 5, producto: '' },
    { fill: 0, colorStart: '#9999ff', colorEnd: '#0000cc', volume: 0, missing: 9999, height: 0, battery: 0, lastUpdate: '', activo: true, tanque: 6, producto: '' },
    { fill: 0, colorStart: '#ff99ff', colorEnd: '#cc00cc', volume: 0, missing: 9999, height: 0, battery: 0, lastUpdate: '', activo: true, tanque: 7, producto: '' },
    { fill: 0, colorStart: '#ff6666', colorEnd: '#cc0000', volume: 0, missing: 9999, height: 0, battery: 0, lastUpdate: '', activo: true, tanque: 8, producto: '' }
  ];

  productNames: string[] = ["NAFTA SUPER", "V POWER NAFTA", "DIESEL 500", "V POWER DIESEL"];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTankData();
  }

  ngAfterViewInit() {
    setTimeout(() => this.drawGauge(), 500);
  }

  private loadTankData() {
    const heightUrl = 'https://api.thingspeak.com/channels/2729087/feeds.json?api_key=GH1L0B0S7GZAFAU&results=1';
    const volumeUrl = 'https://api.thingspeak.com/channels/2729529/feeds.json?api_key=GH1L0B0S7GZAFAU&results=1';

    this.http.get<any>(heightUrl).subscribe(heightResponse => {
      if (heightResponse.feeds && heightResponse.feeds.length > 0) {
        const feed = heightResponse.feeds[0];

        for (let i = 0; i < 8; i++) {
          if (feed[`field${i + 1}`]) {
            const [altura, bateria, faltante, lastUpdate, productoId] = feed[`field${i + 1}`].split(',');

            this.gaugesData[i].height = parseFloat(altura) || 0;
            this.gaugesData[i].battery = parseFloat(bateria) || 0;
            this.gaugesData[i].missing = parseFloat(faltante) || 0;
            this.gaugesData[i].lastUpdate = lastUpdate || '';
            this.gaugesData[i].producto = this.productNames[parseInt(productoId)] || 'Desconocido';

            const maxAltura = 2000;
            this.gaugesData[i].fill = this.gaugesData[i].height / maxAltura;
            this.gaugesData[i].fill = Math.max(0, Math.min(1, this.gaugesData[i].fill));
          }
        }

        this.http.get<any>(volumeUrl).subscribe(volumeResponse => {
          if (volumeResponse.feeds && volumeResponse.feeds.length > 0) {
            const volumeFeed = volumeResponse.feeds[0];

            for (let i = 0; i < 8; i++) {
              this.gaugesData[i].volume = parseFloat(volumeFeed[`field${i + 1}`]) || 0;
            }

            this.drawGauge();
          }
        }, error => {
          console.error('Error al cargar volúmenes:', error);
        });
      }
    }, error => {
      console.error('Error al cargar alturas:', error);
    });
  }
private phase: number = 0;
private texturePattern: CanvasPattern | null = null;

  private drawGauge() {
    // Precarga de textura si no está lista
    if (!this.texturePattern) {
      const textureImg = new Image();
      textureImg.src = 'assets/fuel_texture.png'; // Ajusta la ruta
      textureImg.onload = () => {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          this.texturePattern = tempCtx.createPattern(textureImg, 'repeat');
          this.drawGauge(); // Redibuja
        }
      };
      return;
    }
  
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
  
      // =============================
      // 1) ARO METÁLICO EXTERIOR
      // =============================
      // Dibuja un anillo plateado con un gradiente radial
      const ringWidth = 6; // Grosor del anillo metálico
      const outerRadius = radius + ringWidth;
      const ringGradient = ctx.createRadialGradient(
        centerX, centerY, outerRadius * 0.1,
        centerX, centerY, outerRadius
      );
      ringGradient.addColorStop(0, '#cccccc');
      ringGradient.addColorStop(1, '#666666');
  
      // Dibuja el anillo
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.fillStyle = ringGradient;
      ctx.fill();
  
      // =============================
      // 2) FONDO INTERIOR (gris)
      // =============================
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
  
      // Fondo interior gris (más oscuro para simular profundidad)
      const interiorGradient = ctx.createRadialGradient(
        centerX, centerY, radius * 0.05,
        centerX, centerY, radius
      );
      interiorGradient.addColorStop(0, '#e0e0e0');
      interiorGradient.addColorStop(1, '#aaaaaa');
      ctx.fillStyle = interiorGradient;
      ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
  
      // =============================
      // 3) REFLEJO SUPERIOR (highlight)
      // =============================
      // Simulamos un arco claro en la parte superior
      ctx.beginPath();
      const highlightRadius = radius * 0.7;
      ctx.arc(centerX, centerY - radius * 0.3, highlightRadius, Math.PI, 2 * Math.PI, false);
      ctx.closePath();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.globalAlpha = 1;
  
      // =============================
      // 4) LÍQUIDO CON ONDA Y TEXTURA
      // =============================
      // Calcula el fill y la onda
      const fillHeight = radius * 2 * gauge.fill;
      const baseFillY = centerY + radius - fillHeight;
      // Ajustar parámetros de onda
      const amplitude = 2;
      const waveFrequency = 0.08;
      this.phase += 0.005;
  
      // Onda
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY + radius);
      for (let x = -radius; x <= radius; x++) {
        const waveY = baseFillY + amplitude * Math.sin(x * waveFrequency + this.phase);
        ctx.lineTo(centerX + x, waveY);
      }
      ctx.lineTo(centerX + radius, centerY + radius);
      ctx.lineTo(centerX - radius, centerY + radius);
      ctx.closePath();
  
      // Gradiente base del líquido
      const fillGradient = ctx.createLinearGradient(
        0, centerY + radius,
        0, centerY - radius
      );
      fillGradient.addColorStop(0, gauge.colorStart);
      fillGradient.addColorStop(1, gauge.colorEnd);
      ctx.fillStyle = fillGradient;
      ctx.fill();
  
      // Superponer la textura con opacidad
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = this.texturePattern!;
      ctx.fill();
      ctx.globalAlpha = 1;
  
      ctx.restore();
  
      // =============================
      // 5) Borde interno del tanque
      // =============================
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    });
  
    // Animación continua
    requestAnimationFrame(() => this.drawGauge());
  }
  
  
}

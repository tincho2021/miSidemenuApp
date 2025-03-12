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
  alarmColor?: string; // Para el aro de alarma
}

const productColors = [
  { product: "NAFTA SUPER", colorStart: "#ff0000", colorEnd: "#ff4d4d" }, // Rojo
  { product: "V POWER NAFTA", colorStart: "#0000ff", colorEnd: "#4d4dff" }, // Azul
  { product: "DIESEL 500", colorStart: "#ffff00", colorEnd: "#ffff66" }, // Amarillo
  { product: "V POWER DIESEL", colorStart: "#00ff00", colorEnd: "#66ff66" }  // Verde
];

@Component({
  selector: 'app-tanques',
  templateUrl: './tanques.page.html',
  styleUrls: ['./tanques.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule]
})
export class TanquesPage implements OnInit, AfterViewInit {

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

  // Datos del canal de alarmas en ThingSpeak
  private alarmChannelId = '2774824';
  private alarmApiKey = 'VMLCH1QI8KKX1LCJ';

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
            const [altura, bateria, faltante, lastUpdate, productoIdStr] = feed[`field${i + 1}`].split(',');
            const productoId = parseInt(productoIdStr);
            // Asigna los datos
            this.gaugesData[i].height = parseFloat(altura) || 0;
            this.gaugesData[i].battery = parseFloat(bateria) || 0;
            this.gaugesData[i].missing = parseFloat(faltante) || 0;
            this.gaugesData[i].lastUpdate = lastUpdate || '';
            
            // Usa el mapeo para asignar el nombre y colores del producto
            if (!isNaN(productoId) && productoId >= 0 && productoId < productColors.length) {
              this.gaugesData[i].producto = productColors[productoId].product;
              this.gaugesData[i].colorStart = productColors[productoId].colorStart;
              this.gaugesData[i].colorEnd = productColors[productoId].colorEnd;
            } else {
              this.gaugesData[i].producto = "Desconocido";
            }
  
            const maxAltura = 2000;
            this.gaugesData[i].fill = Math.max(0, Math.min(1, this.gaugesData[i].height / maxAltura));
          }
        }
  
        // Cargar volúmenes
        this.http.get<any>(volumeUrl).subscribe(volumeResponse => {
          if (volumeResponse.feeds && volumeResponse.feeds.length > 0) {
            const volumeFeed = volumeResponse.feeds[0];
            for (let i = 0; i < 8; i++) {
              this.gaugesData[i].volume = parseFloat(volumeFeed[`field${i + 1}`]) || 0;
            }
            // Cargar alarmas para definir el color del aro
            this.loadAlarmData();
          }
        }, error => {
          console.error('Error al cargar volúmenes:', error);
        });
      }
    }, error => {
      console.error('Error al cargar alturas:', error);
    });
  }
  
  /**
   * Carga las alarmas desde el canal de alarmas y asigna alarmColor.
   */
  private loadAlarmData() {
    const alarmUrl = `https://api.thingspeak.com/channels/${this.alarmChannelId}/feeds.json?api_key=${this.alarmApiKey}&results=1`;
    this.http.get<any>(alarmUrl).subscribe(response => {
      if (response.feeds && response.feeds.length > 0) {
        const feed = response.feeds[0];
        for (let i = 0; i < 8; i++) {
          const alarmMsg = feed[`field${i + 1}`];
          if (alarmMsg && alarmMsg.trim() !== '') {
            let color = '#00ff00'; // verde por defecto
            const alarmLower = alarmMsg.toLowerCase();
            if (alarmLower.includes('sobrellenado')) {
              color = '#ff0000'; // rojo
            } else if (alarmLower.includes('bajo') || alarmLower.includes('batería baja')) {
              color = '#ffff00'; // amarillo
            }
            this.gaugesData[i].alarmColor = color;
          } else {
            this.gaugesData[i].alarmColor = '#00ff00';
          }
        }
      } else {
        for (let i = 0; i < 8; i++) {
          this.gaugesData[i].alarmColor = '#00ff00';
        }
      }
      this.drawGauge();
    }, error => {
      console.error('Error al cargar alarmas:', error);
      for (let i = 0; i < 8; i++) {
        this.gaugesData[i].alarmColor = '#00ff00';
      }
      this.drawGauge();
    });
  }

  private phase: number = 0;
  private texturePattern: CanvasPattern | null = null;

  private drawGauge() {
    // Precarga de la textura
    if (!this.texturePattern) {
      const textureImg = new Image();
      textureImg.src = 'assets/fuel_texture.png';
      textureImg.onload = () => {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          this.texturePattern = tempCtx.createPattern(textureImg, 'repeat');
          this.drawGauge();
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
      const ringWidth = 6;
      const outerRadius = radius + ringWidth;
      const ringGradient = ctx.createRadialGradient(
        centerX, centerY, outerRadius * 0.1,
        centerX, centerY, outerRadius
      );
      ringGradient.addColorStop(0, '#cccccc');
      ringGradient.addColorStop(1, '#666666');

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.fillStyle = ringGradient;
      ctx.fill();

      // =============================
      // 1.1) ARO DE ALARMA CON "BOLA DE LUZ"
      // =============================
      const alarmColor = gauge.alarmColor || '#00ff00';
      // Dibujar el aro de alarma
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = alarmColor;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Dibujar la bola de luz con resplandor y rotación rápida
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(this.phase * 0.5); // Rotación más rápida
      ctx.translate(-centerX, -centerY);
      ctx.shadowBlur = 15;
      ctx.shadowColor = alarmColor;
      ctx.beginPath();
      const ballRadius = 4;
      const ballX = centerX;
      const ballY = centerY - outerRadius;
      ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
      ctx.fillStyle = alarmColor;
      ctx.fill();
      ctx.restore();

      // =============================
      // 2) FONDO INTERIOR (gris)
      // =============================
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();

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
      const highlightRadius = radius * 0.7;
      ctx.beginPath();
      ctx.arc(centerX, centerY - radius * 0.3, highlightRadius, Math.PI, 2 * Math.PI, false);
      ctx.closePath();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.globalAlpha = 1;

      // =============================
      // 4) LÍQUIDO CON ONDA Y TEXTURA CON ANIMACIÓN
      // =============================
      const fillHeight = radius * 2 * gauge.fill;
      const baseFillY = centerY + radius - fillHeight;
      const amplitude = 2;
      const waveFrequency = 0.08;
      this.phase += 0.005;

      // Construir el path de la onda y aplicar clip
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY + radius);
      for (let x = -radius; x <= radius; x++) {
        const waveY = baseFillY + amplitude * Math.sin(x * waveFrequency + this.phase);
        ctx.lineTo(centerX + x, waveY);
      }
      ctx.lineTo(centerX + radius, centerY + radius);
      ctx.lineTo(centerX - radius, centerY + radius);
      ctx.closePath();
      ctx.clip();

      const fillGradient = ctx.createLinearGradient(
        0, centerY + radius,
        0, centerY - radius
      );
      fillGradient.addColorStop(0, gauge.colorStart);
      fillGradient.addColorStop(1, gauge.colorEnd);
      ctx.fillStyle = fillGradient;
      ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

      // Dibujar la textura oscilante (va y vuelve)
      ctx.save();
      const textureOffset = 10 * Math.sin(this.phase * 0.5);
      ctx.translate(textureOffset, 0);
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = this.texturePattern!;
      ctx.fillRect(centerX - radius - 50, centerY - radius - 50, radius * 2 + 100, radius * 2 + 100);
      ctx.restore();

      ctx.restore();

      // =============================
      // 5) BORDE INTERNO DEL TANQUE
      // =============================
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();

      // =============================
      // 6) PORCENTAJE DE LLENO DEL TANQUE
      // =============================
      let percentage = 0;
      if (gauge.volume + gauge.missing > 0) {
        percentage = Math.round((gauge.volume / (gauge.volume + gauge.missing)) * 100);
      }
      // Configurar fuente y estilos para el texto
      ctx.font = "bold 36px Arial";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgb(0, 0, 0)";
      ctx.shadowBlur = 50;
      ctx.fillText(percentage + "%", centerX, centerY);
      ctx.lineWidth = 0.2;
      ctx.strokeStyle = "#ff00000";
      ctx.strokeText(percentage + "%", centerX, centerY);
    });

    requestAnimationFrame(() => this.drawGauge());
  }
}

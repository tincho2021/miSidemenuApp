import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
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
  alarmColor: string;
}

const productColors = [
  { product: "NAFTA SUPER",  colorStart: "#ff0000", colorEnd: "#ff4d4d" },
  { product: "V POWER NAFTA", colorStart: "#0000ff", colorEnd: "#4d4dff" },
  { product: "DIESEL 500",    colorStart: "#ffff00", colorEnd: "#ffff66" },
  { product: "V POWER DIESEL", colorStart: "#00ff00", colorEnd: "#66ff66" }
];

@Component({
  selector: 'app-tanques',
  templateUrl: './tanques.page.html',
  styleUrls: ['./tanques.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule]
})
export class TanquesPage implements OnInit, AfterViewInit, OnDestroy {

  private refreshInterval!: any;

  gaugesData: GaugeData[] = Array.from({ length: 8 }, (_, i) => ({
    fill: 0,
    colorStart: '#ffffff',
    colorEnd: '#cccccc',
    volume: 0,
    missing: 9999,
    height: 0,
    battery: 0,
    lastUpdate: '',
    activo: true,
    tanque: i + 1,
    producto: '',
    alarmColor: '#00ff00'
  }));


private alarmChannelId = '3004323';
private alarmApiKey    = 'QW0YYQGH7P4Q9W5W';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTankData();
    this.refreshInterval = setInterval(() => this.loadTankData(), 30000);
  }

  ngAfterViewInit() {
    setTimeout(() => this.drawGauge(), 500);
  }

  ngOnDestroy() {
    clearInterval(this.refreshInterval);
  }

  private loadTankData() {
    const heightUrl = 'https://api.thingspeak.com/channels/3004319/feeds.json?api_key=C5VAW60ORB52237N&results=1';
    const volumeUrl = 'https://api.thingspeak.com/channels/3004320/feeds.json?api_key=NB0890V99WCMF5X4&results=1';

    this.http.get<any>(heightUrl).subscribe(heightResponse => {
      const feed = heightResponse.feeds?.[0];
      if (!feed) return;

      for (let i = 0; i < 8; i++) {
        const raw = feed[`field${i+1}`];
        if (!raw) continue;
        const [altura, bateria, faltante, lastUpdate, productoIdStr] = raw.split(',');
        const pid = parseInt(productoIdStr, 10);

        this.gaugesData[i].height     = parseFloat(altura) || 0;
        this.gaugesData[i].battery    = parseFloat(bateria) || 0;
        this.gaugesData[i].missing    = parseFloat(faltante) || 0;
        this.gaugesData[i].lastUpdate = lastUpdate || '';

        if (!isNaN(pid) && pid >= 0 && pid < productColors.length) {
          this.gaugesData[i].producto   = productColors[pid].product;
          this.gaugesData[i].colorStart = productColors[pid].colorStart;
          this.gaugesData[i].colorEnd   = productColors[pid].colorEnd;
        } else {
          this.gaugesData[i].producto = 'Desconocido';
        }
      }

      this.http.get<any>(volumeUrl).subscribe(volumeResponse => {
        const vFeed = volumeResponse.feeds?.[0];
        if (!vFeed) return;

        for (let i = 0; i < 8; i++) {
          const vol = parseFloat(vFeed[`field${i+1}`]) || 0;
          this.gaugesData[i].volume = vol;
          if (vol === 0) {
            this.gaugesData[i].activo = false;
            this.gaugesData[i].fill   = 0;
          } else {
            this.gaugesData[i].activo = true;
            const total = this.gaugesData[i].missing + vol;
            this.gaugesData[i].fill = total > 0 ? Math.min(1, vol/total) : 0;
          }
        }
        this.loadAlarmData();
      }, err => console.error('Error cargando volúmenes:', err));
    }, err => console.error('Error cargando alturas:', err));
  }

  private loadAlarmData() {
    const url = `https://api.thingspeak.com/channels/${this.alarmChannelId}/feeds.json?api_key=${this.alarmApiKey}&results=1`;
    this.http.get<any>(url).subscribe(res => {
      const feed = res.feeds?.[0] || {};
      for (let i = 0; i < 8; i++) {
        const raw = (feed[`field${i+1}`] || '').trim().toLowerCase();
        if (raw.includes('alarm') || raw.includes('alarma')) {
          this.gaugesData[i].alarmColor = '#ff0000';
        } else {
          this.gaugesData[i].alarmColor = '#00ff00';
        }
      }
      this.drawGauge();
    }, err => {
      console.error('Error cargando alarmas:', err);
      this.gaugesData.forEach(g => g.alarmColor = '#00ff00');
      this.drawGauge();
    });
  }

  private phase = 0;
  private texturePattern: CanvasPattern | null = null;

  private drawGauge() {
    if (!this.texturePattern) {
      const img = new Image();
      img.src = 'assets/fuel_texture.png';
      img.onload = () => {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) this.texturePattern = tempCtx.createPattern(img, 'repeat');
        this.drawGauge();
      };
      return;
    }

    const canvases = document.querySelectorAll('canvas');
    canvases.forEach((canvas: any, index: number) => {
      const gauge = this.gaugesData[index];
      const ctx = (canvas as HTMLCanvasElement).getContext('2d');
      if (!ctx) return;

      if (!gauge.activo) {
        canvas.style.display = 'none';
        return;
      }
      canvas.style.display = 'block';
      canvas.width  = 220;
      canvas.height = 220;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r  = Math.min(cx, cy) - 10;
      const outerR = r + 6;

      // ARO METÁLICO
      const ringG = ctx.createRadialGradient(cx, cy, outerR*0.1, cx, cy, outerR);
      ringG.addColorStop(0, '#cccccc');
      ringG.addColorStop(1, '#666666');
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, 2*Math.PI);
      ctx.arc(cx, cy,    r, 0, 2*Math.PI, true);
      ctx.closePath();
      ctx.fillStyle = ringG;
      ctx.fill();

      // ARO DE ALARMA
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, 2*Math.PI);
      ctx.strokeStyle = gauge.alarmColor;
      ctx.lineWidth   = 4;
      ctx.stroke();

      // BOLA DE LUZ
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(this.phase * 0.5);
      ctx.translate(-cx, -cy);
      ctx.shadowBlur  = 15;
      ctx.shadowColor = gauge.alarmColor;
      ctx.beginPath();
      ctx.arc(cx, cy - outerR, 4, 0, 2*Math.PI);
      ctx.fillStyle = gauge.alarmColor;
      ctx.fill();
      ctx.restore();

      // FONDO INTERIOR
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2*Math.PI);
      ctx.closePath(); ctx.clip();
      const intG = ctx.createRadialGradient(cx, cy, r*0.05, cx, cy, r);
      intG.addColorStop(0, '#e0e0e0');
      intG.addColorStop(1, '#aaaaaa');
      ctx.fillStyle = intG;
      ctx.fillRect(cx-r, cy-r, r*2, r*2);

      // REFLEJO SUPERIOR
      ctx.beginPath();
      ctx.arc(cx, cy - r*0.3, r*0.7, Math.PI, 2*Math.PI);
      ctx.globalAlpha = 0.2;
      ctx.fillStyle   = '#ffffff';
      ctx.fill();
      ctx.globalAlpha = 1;

      // LÍQUIDO
      const fillH   = r*2 * gauge.fill;
      const baseY   = cy + r - fillH;
      this.phase  += 0.005;
      ctx.beginPath();
      ctx.moveTo(cx - r, cy + r);
      for (let x = -r; x <= r; x++) {
        const y = baseY + 2 * Math.sin(x*0.08 + this.phase);
        ctx.lineTo(cx + x, y);
      }
      ctx.lineTo(cx + r, cy + r);
      ctx.closePath(); ctx.clip();

      const fillG = ctx.createLinearGradient(0, cy+r, 0, cy-r);
      fillG.addColorStop(0, gauge.colorStart);
      fillG.addColorStop(1, gauge.colorEnd);
      ctx.fillStyle = fillG;
      ctx.fillRect(cx-r, cy-r, r*2, r*2);

      ctx.save();
      const offset = 10 * Math.sin(this.phase * 0.5);
      ctx.translate(offset, 0);
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = this.texturePattern!;
      ctx.fillRect(cx-r-50, cy-r-50, r*2+100, r*2+100);
      ctx.restore();
      ctx.restore();

      // BORDE INTERNO
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2*Math.PI);
      ctx.lineWidth   = 1;
      ctx.strokeStyle = '#333';
      ctx.stroke();

      // PORCENTAJE
      const pct = gauge.volume + gauge.missing > 0
        ? Math.round(gauge.volume / (gauge.volume + gauge.missing) * 100)
        : 0;
      ctx.font         = "bold 36px Arial";
      ctx.fillStyle    = "#ffffff";
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor  = "rgba(0,0,0,0.5)";
      ctx.shadowBlur   = 10;
      ctx.fillText(pct + "%", cx, cy);
    });

    requestAnimationFrame(() => this.drawGauge());
  }
}

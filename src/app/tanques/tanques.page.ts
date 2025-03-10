import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tanques',
  templateUrl: './tanques.page.html',
  styleUrls: ['./tanques.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class TanquesPage implements OnInit, AfterViewInit {

  // Ahora cada tanque tiene más datos (volumen, faltante, etc.)
  gaugesData = [
    {
      fill: 0.2,
      colorStart: '#ff9999',
      colorEnd: '#cc0000',
      volume: 7741,
      missing: 13586,
      height: 1067,
      battery: 90,
      lastUpdate: '17/02 13:24'
    },
    {
      fill: 0.4,
      colorStart: '#ffc299',
      colorEnd: '#cc6600',
      volume: 1600,
      missing: 8400,
      height: 1055,
      battery: 62,
      lastUpdate: '17/02 13:23'
    },
    {
      fill: 0.6,
      colorStart: '#ffff99',
      colorEnd: '#cccc00',
      volume: 9979,
      missing: 18000,
      height: 1444,
      battery: 85,
      lastUpdate: '17/02 13:28'
    },
    {
      fill: 0.8,
      colorStart: '#99ff99',
      colorEnd: '#00cc00',
      volume: 9500,
      missing: 2000,
      height: 1200,
      battery: 80,
      lastUpdate: '17/02 13:24'
    },
    {
      fill: 0.3,
      colorStart: '#99ffff',
      colorEnd: '#00cccc',
      volume: 6000,
      missing: 4000,
      height: 800,
      battery: 70,
      lastUpdate: '17/02 13:20'
    },
    {
      fill: 0.7,
      colorStart: '#9999ff',
      colorEnd: '#0000cc',
      volume: 5000,
      missing: 9000,
      height: 950,
      battery: 65,
      lastUpdate: '17/02 13:22'
    },
    {
      fill: 0.5,
      colorStart: '#ff99ff',
      colorEnd: '#cc00cc',
      volume: 3000,
      missing: 12000,
      height: 700,
      battery: 75,
      lastUpdate: '17/02 13:25'
    },
    {
      fill: 1.0,
      colorStart: '#ff6666',
      colorEnd: '#cc0000',
      volume: 9999,
      missing: 0,
      height: 1500,
      battery: 95,
      lastUpdate: '17/02 13:24'
    }
  ];

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.drawGauge();
  }

  private drawGauge() {
    const canvases = document.querySelectorAll('canvas');
    if (!canvases || canvases.length === 0) {
      console.error('No se encontraron canvas');
      return;
    }

    canvases.forEach((canvas: HTMLCanvasElement, index: number) => {
      // Ajustamos el tamaño del canvas para dejar espacio a la sombra
      canvas.width = 220;
      canvas.height = 220;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('No se pudo obtener el contexto 2D');
        return;
      }

      // Limpia el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const circleRadius = Math.min(canvas.width, canvas.height) / 2 - 15;
      // Calculamos centro y radio, con un margen mayor para la sombra
      const centerX = canvas.width / 2;
      const centerY = circleRadius + 10;
      const radius = Math.min(centerX, centerY) - 15; // -15 para mayor espacio

      // Configuración de este tanque
      const gauge = this.gaugesData[index] || { fill: 0.5, colorStart: '#ff9999', colorEnd: '#cc0000' };

      // =========================
      // 1) Sombra para el fondo
      // =========================
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.15)'; // color de sombra suave
      ctx.shadowBlur = 10;                  // difuminado
      ctx.shadowOffsetX = 5;                // desplazamiento en X
      ctx.shadowOffsetY = 5;                // desplazamiento en Y

      // Gradiente radial para un fondo “glass”
      const bgGradient = ctx.createRadialGradient(
        centerX, centerY, radius * 0.1,
        centerX, centerY, radius
      );
      bgGradient.addColorStop(0, '#f5f5f5'); // tono claro
      bgGradient.addColorStop(1, '#dcdcdc'); // tono algo más oscuro

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = bgGradient;
      ctx.fill();

      // Quitamos la sombra para que no afecte lo siguiente
      ctx.restore();

      // =========================
      // 2) Clip y líquido
      // =========================
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();

      // Altura del líquido
      const fillHeight = radius * 2 * gauge.fill;
      const fillY = centerY + radius - fillHeight;

      // Gradiente del líquido
      const fillGradient = ctx.createLinearGradient(
        0, centerY + radius,
        0, centerY - radius
      );
      fillGradient.addColorStop(0, gauge.colorStart);
      fillGradient.addColorStop(1, gauge.colorEnd);

      // Relleno del líquido
      ctx.fillStyle = fillGradient;
      ctx.fillRect(centerX - radius, fillY, radius * 2, fillHeight);

      ctx.restore();

      // =========================
      // 3) Borde suave (opcional)
      // =========================
      ctx.strokeStyle = 'rgba(0,0,0,0.2)'; // borde más tenue
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    });
  }
}

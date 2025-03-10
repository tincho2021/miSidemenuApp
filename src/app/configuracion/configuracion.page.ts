import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TankConfig {
  tanque: number;
  alturaMaxima: number;
  volumenMaximo: number;
  color: string;
  producto: string;
  activo: boolean;
}

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConfiguracionPage {
  // Lista de productos disponibles
  productos: string[] = ['Nafta Super', 'V Power Nafta', 'V Power Diesel', 'Diesel 500'];

  // Array de configuraciones, uno por tanque (asumimos 8 tanques)
  tankConfigs: TankConfig[] = [];

  constructor() {
    // Inicializa cada configuración con valores predeterminados
    for (let i = 1; i <= 8; i++) {
      this.tankConfigs.push({
        tanque: i,
        alturaMaxima: 2000,      // Valor por defecto (en mm)
        volumenMaximo: 10000,     // Valor por defecto (en litros)
        color: '#ffffff',         // Color por defecto (blanco)
        producto: this.productos[0], // Producto por defecto
        activo: true             // Por defecto, el tanque está activo
      });
    }
  }

  guardarConfiguracion() {
    // Guarda la configuración, por ejemplo en localStorage
    localStorage.setItem('tankConfigs', JSON.stringify(this.tankConfigs));
    console.log("Configuración guardada:", this.tankConfigs);
  }
}

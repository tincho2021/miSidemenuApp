import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Importa los componentes que usarás en la plantilla
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton
} from '@ionic/angular/standalone';

// Interfaz para manejar los datos parseados
interface DescargaParsed {
  created_at: string;          // Fecha/hora que da ThingSpeak
  fecha: string;               // Fecha/hora parseada desde la cadena
  producto: string;
  volumenDescargado: string;
  turno: string;
  volInicial: string;
  volFinal: string;
  temperatura?: string;        // Opcional
}

@Component({
  selector: 'app-descargas',
  templateUrl: './descargas.page.html',
  styleUrls: ['./descargas.page.scss'],
  standalone: true,
  // Asegúrate de importar todos los componentes que uses en el HTML
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    CommonModule,
    FormsModule,
    HttpClientModule
  ]
})
export class DescargasPage implements OnInit {

  // Array donde guardamos las descargas parseadas
  descargas: DescargaParsed[] = [];

  // Ajusta estos valores a tu canal de descargas
  private thingSpeakChannelId = '2774825';
  private thingSpeakApiKey = 'TWOSPXYG6J64RAP8'; // Reemplaza si tu canal requiere API Key

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarDescargas();
  }

  /**
   * Solicita los feeds a ThingSpeak y los parsea.
   */
  cargarDescargas() {
    // Pedimos los últimos 10 feeds (ajusta results si quieres más o menos)
    const url = `https://api.thingspeak.com/channels/${this.thingSpeakChannelId}/feeds.json?api_key=${this.thingSpeakApiKey}&results=10`;
    this.http.get<any>(url).subscribe(response => {
      if (response.feeds && response.feeds.length > 0) {
        // Convertimos cada feed en un objeto parseado (o null si no hay cadena)
        const descargasMapeadas = response.feeds.map((feed: any) => {
          return this.parseDescarga(feed); // parsea field1..field5
        }).filter((d: DescargaParsed | null) => d !== null) as DescargaParsed[];

        this.descargas = descargasMapeadas;
        console.log("Descargas cargadas:", this.descargas);
      } else {
        console.log("No hay descargas registradas.");
        this.descargas = [];
      }
    }, error => {
      console.error('Error al cargar descargas:', error);
    });
  }

  /**
   * parseDescarga: busca en field1..field5 alguna cadena de la forma:
   *   "2025-03-12 16:39:43, DIESEL 500, 185.00, 2, 4590.00, 4775.00, 15"
   * y la convierte en un objeto DescargaParsed.
   */
  private parseDescarga(feed: any): DescargaParsed | null {
    // Recorremos field1..field5 para ver dónde se encuentra la cadena
    for (let i = 1; i <= 5; i++) {
      const valor = feed[`field${i}`];
      if (valor && valor.trim() !== '') {
        // Separa la cadena por comas
        const partes = valor.split(',').map((p: string) => p.trim());
        // Esperamos al menos 6 partes: [fecha, producto, volDesc, turno, volIni, volFin, (temperatura opcional)]
        if (partes.length >= 6) {
          return {
            created_at: feed.created_at,
            fecha: partes[0],
            producto: partes[1],
            volumenDescargado: partes[2],
            turno: partes[3],
            volInicial: partes[4],
            volFinal: partes[5],
            temperatura: partes[6] || ''
          };
        }
      }
    }
    // Si no se encontró ningún field con cadena válida, retorna null
    return null;
  }
}

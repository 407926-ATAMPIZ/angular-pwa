import {Component, inject, OnInit, signal} from '@angular/core';
import {MapaComponent} from './mapa/mapa.component';
import {NominatimPlace} from '../../models/nominatim-place'
import {GeosearchService} from '../../services/geosearch.service';
import {debounceTime, distinctUntilChanged, Subject, switchMap} from 'rxjs';
import {Position} from '../../models/position';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-direcciones',
  imports: [
    MapaComponent,
    FormsModule
  ],
  templateUrl: './direcciones.component.html',
  styleUrl: './direcciones.component.scss'
})
export class DireccionesComponent implements OnInit {
  private geosearchService = inject(GeosearchService);
  // País/provincia inferidos una vez al inicio (para limitar los resultados de la búsqueda)
  country = signal<string>('');         // ej. "Argentina"
  state = signal<string>('');         // ej. "San Juan"
  // Signal to hold the current position
  currentPosition = signal<Position>({display_name:"", lon:0, lat:0});


  // Input del usuario
  query = '';

  // Sugerencias de búsqueda
  results = signal<NominatimPlace[]>([]);

  // Destinos acumulados (para emitirlos al <app-mapa>)
  destinos = signal<Position[]>([
    {lat:-31.531652, lon:-68.587372, display_name:"Plaza Bº Rioja"},
    {lat:-31.5322547, lon:-68.5934065, display_name:"Parque Rivadavia"},
  ]);

  // Subject para manejar debounce (tecnica usada para controlar la frecuencia de las solicitudes de búsqueda)
  private input$ = new Subject<string>();

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(p => {
      const latitude = p.coords.latitude;
      const longitude = p.coords.longitude;

      this.geosearchService.reverse(latitude, longitude).subscribe(pos => {
        this.country.set(pos.country || '');
        this.state.set(pos.state || '');
        this.currentPosition.set({ lat: latitude, lon: longitude, display_name: "Current Position" });
      });
    });

    // Manejar búsquedas con debounce
    this.input$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(q =>
          this.geosearchService.search(q, this.currentPosition()?.lat, this.currentPosition()?.lon)
        )
      )
      .subscribe(this.results);
  }


  onSearchInput() {
    console.log(this.query)
  }

  seleccionar(result: NominatimPlace) {
  //   implementar metodo para seleccionar el destino sugerido como búsqueda, al seleccionar una sugerencia se agrega a la lista de destinos y se muestra en el mapa
  }
}

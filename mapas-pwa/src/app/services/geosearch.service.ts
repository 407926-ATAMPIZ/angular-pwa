import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Position} from '../models/position';
import {NominatimPlace} from '../models/nominatim-place';

@Injectable({providedIn: 'root'})
export class GeosearchService {
  private readonly baseUrl = 'https://nominatim.openstreetmap.org';
  private readonly http = inject(HttpClient);

  /* ---------- 1) Store de destinos seleccionados ---------- */
  private _destinos: WritableSignal<Position[]> = signal([]);
  /** Observable/Snapshot solo de lectura para los componentes */
  readonly destinos = computed(() => this._destinos());

  addDestino(pos: Position) {
    this._destinos.set([...this._destinos(), pos]);
  }

  removeDestino(index: number) {
    const nuevo = this._destinos().filter((_, i) => i !== index);
    this._destinos.set(nuevo);
  }

  /* ---------- 2) Reverse geocoding para país/provincia ---------- */
  reverse(lat: number, lng: number): Observable<{ country: string; state: string }> {
    const params = new HttpParams()
      .set('lat', lat)
      .set('lon', lng)
      .set('format', 'json')
      .set('addressdetails', '1');

    return this.http.get<any>(`${this.baseUrl}/reverse`, {params}).pipe(
      map(r => ({
        country: r.address?.country ?? '',
        state: r.address?.state ?? ''
      }))
    );
  }

  /* ---------- 3) Búsqueda con viewbox centrado en la ubicación del usuario ---------- */
  /**
   * @param query Calle + numeración
   * @param centerLat  latitud del usuario
   * @param centerLon  longitud del usuario
   * @param deltaDeg   radio en grados para el viewbox (≈0.1 ≃ 11 km)
   */
  search(
    query: string,
    centerLat: number,
    centerLon: number,
    deltaDeg = 0.1
  ): Observable<Position[]> {
    // viewbox: [minLon,minLat,maxLon,maxLat]
    const viewbox = [
      centerLon - deltaDeg,
      centerLat - deltaDeg,
      centerLon + deltaDeg,
      centerLat + deltaDeg
    ].join(',');

    const params = new HttpParams()
      .set('q', query)
      .set('format', 'json')
      .set('addressdetails', '1')
      .set('limit', '5')
      .set('viewbox', viewbox)
      .set('bounded', '1'); // fuerza a quedarse dentro del rectángulo

    return this.http.get<NominatimPlace[]>(`${this.baseUrl}/search`, {params}).pipe(
      map(results =>
        results.map(p => ({
          lat: p.lat,
          lon: p.lon,
          display_name: p.display_name,
          country: p.address.country,
          state: p.address.state,
          city: p.address.city ?? p.address.town ?? p.address.village
        }))
      )
    );
  }

  //TODO: continuar acá, métodos para consumir api de nominatim de openstreetmap
  // Implementar búsqueda de destinos:
  //  -Inputs:
  //    *query: Direccion en formato de texto "Pueyrredon 1510 Córdoba"
  //  -Primer Output:
  //    *sugerencias: Listado de 5 Position (photon), clickeables, para seleccionar como destino, limitadas al viewbox definida por la ubicacion del cliente
  // Implementar agregado de destinos:
  //  -Input:
  //    *Position obtenida de la búsqueda o de las recomendaciones.
  //  -Output: Destino marcado en el mapa con un marker
}

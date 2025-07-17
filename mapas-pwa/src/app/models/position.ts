import { GeoPoint } from './geo-point';

/**
 * Modelo interno de la app
 * No incluye todo lo que devuelve Nominatim, solo lo necesario + las coordenadas y el displayName.
 */
export interface Position extends GeoPoint {
  country?: string;
  state?: string;
  city?: string;
}

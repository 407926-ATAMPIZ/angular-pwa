import { GeoPoint } from './geo-point';

export interface NominatimPlace extends GeoPoint {
  place_id: number;
  address: {
    country?: string;
    state?: string;
    city?: string;
    town?: string;
    village?: string;
    country_code?: string;
  };
}

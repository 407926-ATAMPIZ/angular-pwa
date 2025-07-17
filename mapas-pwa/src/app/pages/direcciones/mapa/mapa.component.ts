import {AfterViewInit, Component, effect, Input, OnDestroy, signal} from '@angular/core';
import * as L from 'leaflet';
import {NominatimPlace} from '../../../models/nominatim-place';
import {Position} from '../../../models/position';

@Component({
  selector: 'app-mapa',
  imports: [],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.scss'
})
export class MapaComponent implements AfterViewInit, OnDestroy {
  // Leaflet map instance
  private map!: L.Map;
  // Signal to hold the current position
  @Input() currentPosition = signal<Position | null>(null);
  // Input to receive an array of destination positions
  @Input() destinos: Array<Position> = [];

  ngAfterViewInit(): void {
    console.log("Angular has completed initialization of MAPA's view.");
    // Initialize the Leaflet map
    this.map = L.map('map').setView([0, 0], 13);
    // load OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    // current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(p => {
        const latitude = p.coords.latitude
        const longitude = p.coords.longitude
        // Update the current position signal
        this.currentPosition.set({lat: latitude, lon: longitude, display_name: "You're Here!"})
        console.log("Current position:", this.currentPosition()?.lat, this.currentPosition()?.lon);
        // Center the map on the current position
        this.map.setView([latitude, longitude, 0], 15);
        // Add a marker for the current position
        L.marker([latitude, longitude], {icon: this.iconoOrigen()})
          .addTo(this.map)
          .bindPopup('You are here!')
          .openPopup();
      })
    }
    // Add markers for each destination
    // effect(() => {
    // Adds a marker in the map for each destination
    this.destinos.forEach(pos => {
      L.marker([pos.lat, pos.lon], {icon: this.iconoDestino()})
        .addTo(this.map)
        .bindPopup(pos.display_name);
    });
    // });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      console.log("Leaflet map has been removed.");
    } else {
      console.warn("No Leaflet map instance to remove.");
    }
  }

  private iconoDestino() {
    return L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/15425/15425048.png',
      iconSize: [32, 32],
      iconAnchor: [4, 32],
      popupAnchor: [12, -26],

    })
  }

  private iconoOrigen() {
    return L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -30],
    })
  }
}

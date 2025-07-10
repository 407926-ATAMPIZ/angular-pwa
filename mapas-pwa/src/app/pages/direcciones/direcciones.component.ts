import {Component} from '@angular/core';
import {MapaComponent} from './mapa/mapa.component';
import {Position} from '../../models/position';

@Component({
  selector: 'app-direcciones',
  imports: [
    MapaComponent
  ],
  templateUrl: './direcciones.component.html',
  styleUrl: './direcciones.component.scss'
})
export class DireccionesComponent {
  destinos: Array<Position> = [
    new Position(-31.529531, -68.587217),
    new Position(-31.535311, -68.580093),
  ];
}

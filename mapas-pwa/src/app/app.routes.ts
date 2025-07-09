import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {HistorialComponent} from './pages/historial/historial.component';
import {MapaComponent} from './pages/mapa/mapa.component';

export const routes: Routes = [
  {path:'', component: MapaComponent},
  {path:'historial', component: HistorialComponent},
  {path:'mapa', component: MapaComponent},
  {path:'inicio', component: HomeComponent},
];

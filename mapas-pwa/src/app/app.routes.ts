import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {HistorialComponent} from './pages/historial/historial.component';
import {DireccionesComponent} from './pages/direcciones/direcciones.component';

export const routes: Routes = [
  {path:'', component: DireccionesComponent},
  {path:'historial', component: HistorialComponent},
  {path:'direcciones', component: DireccionesComponent},
  {path:'inicio', component: HomeComponent},
];

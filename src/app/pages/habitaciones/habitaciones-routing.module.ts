import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CamasComponent } from './components/camas/camas.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { TiposComponent } from './components/tipos/tipos.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'tipos', component: TiposComponent, data: { titulo: 'Tipos de Habitaciones' } },
      { path: 'habitaciones', component: HabitacionesComponent},
      { path: 'camas', component: CamasComponent},
      { path: '**', redirectTo: 'habitaciones' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HabitacionesRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservasComponent } from './components/reservas/reservas.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'reservas', component: ReservasComponent, data: { titulo: 'Calendario/Reservas' } },
      { path: '**', redirectTo: 'reservas' }
    ]
  }  
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarioRoutingModule { }

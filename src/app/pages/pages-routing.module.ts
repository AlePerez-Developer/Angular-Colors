import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './components/pages.component';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';

import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: PagesComponent, //canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard' } },
      {
        path: 'productos',
        loadChildren: () => import('./productos/productos.module').then(m => m.ProductosModule),
        data: { titulo: 'Productos' }
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule),
        data: { titulo: 'Usuarios' }
      },
      {
        path: 'habitaciones',
        loadChildren: () => import('./habitaciones/habitaciones.module').then(m => m.HabitacionesModule),
        data: { titulo: 'Habitaciones' }
      },
      {
        path: 'calendario',
        loadChildren: () => import('./calendario/calendario.module').then(m => m.CalendarioModule),
        data: { titulo: 'Calendario' }
      },
      {
        path: '', redirectTo: 'dashboard', pathMatch: 'full',
      },
      {
        path: '**', redirectTo: 'dashboard', pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class PagesRoutingModule { }

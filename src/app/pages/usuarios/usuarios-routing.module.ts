import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarUsuariosComponent } from './components/usuarios/listar-usuarios.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'listar', component: ListarUsuariosComponent },
      { path: '**', redirectTo: 'listar' }
    ]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }

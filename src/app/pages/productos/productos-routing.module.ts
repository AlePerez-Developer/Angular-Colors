import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ProductosComponent } from './components/productos/productos.component';
import { ServiciosComponent } from './components/servicios/servicios.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'productos', component: ProductosComponent, data: { titulo: 'Lista de Productos' } },
      { path: 'categorias', component: CategoriasComponent, data: { titulo: 'Productos Categorias' } },
      { path: 'servicios', component: ServiciosComponent, data: { titulo: 'Productos Servicios' } },
      { path: '**', redirectTo: 'productos' }
    ]
  }  
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProductosRoutingModule { }

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  usuariosclick(){
    this.router.navigate(['pages/usuarios/listar-usuarios']);
  }

  tiposclick(){
    this.router.navigate(['pages/habitaciones/tipos']);
  }

  habitacionesclick(){
    this.router.navigate(['pages/habitaciones/habitaciones']);
  }

  camasclick(){
    this.router.navigate(['pages/habitaciones/camas']);
  }

  categoriasclick(){
    this.router.navigate(['pages/productos/categorias']);
  }

  productosclick(){
    this.router.navigate(['pages/productos/productos']);
  }

  serviciosclick(){
    this.router.navigate(['pages/productos/servicios']);
  }

}

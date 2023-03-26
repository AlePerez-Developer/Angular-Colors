import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CategoriaInterface } from '../../interfaces/categoria.interface';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
})

export class CategoriasComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  titulo: string
  btnstatus: boolean

  formCategoria: FormGroup

  dataSource!: MatTableDataSource<CategoriaInterface>;
  displayedColumns = ['position', 'Descripcion', 'estado', 'acciones'];

  constructor(private fb: FormBuilder, private toastr: ToastrService, private _categoriaservice: CategoriaService) {
    this.titulo = 'Nueva categoria'
    this.btnstatus = false

    this.formCategoria = this.fb.group({
      codigo: '',
      Descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
    })
  }

  ngOnInit(): void {
    this.listarCategorias()
  }

  listarCategorias() {
    this._categoriaservice.getCategorias().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      this.toastr.error(`No se pudo listar las categorias registradas, ${err.error.msg}`);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  newCategoriaClick() {
    this.titulo = 'Nueva categoria'
    this.btnstatus = !this.btnstatus;
    this.formCategoria.reset()
  }

  getCategoria(id: number) {
    this.newCategoriaClick()
    this.titulo = 'Actualizar categoria'
    this._categoriaservice.getCategoria(id).subscribe(data => {
      this.formCategoria.setValue({
        codigo: data.Codigo,
        Descripcion: data.Descripcion,
      })
    }, err => {
      this.toastr.error(`No se pudo recuperar los datos de la categoria, ${err.error.msg}`);
    })
  }

  procesarGuardado() {
    const categoriaInterface = new CategoriaInterface(
      0,
      this.formCategoria.controls['Descripcion'].value,
      'V'
    )
    if (!this.formCategoria.controls['codigo'].value)
      this.agregarcategoria(categoriaInterface)
    else
      this.actualizarcategoria(categoriaInterface, this.formCategoria.controls['codigo'].value)
  }

  agregarcategoria(categoria: CategoriaInterface) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de registrar la nueva categoria?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._categoriaservice.addNewCategoria(categoria).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.newCategoriaClick()
          this.listarCategorias()
        }, err => {
          this.toastr.error(`Ocurrio un error al agregar la categoria, ${err.error.msg}`);
        })
      }
    })
  }

  actualizarcategoria(categoria: CategoriaInterface, id: number) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de actualizar el usuario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._categoriaservice.updateCategoria(categoria, id).subscribe((rta: any) => {
          this.toastr.success(rta.msg);
          this.newCategoriaClick()
          this.listarCategorias()
        }, err => {
          this.toastr.error(`Ocurrio un error al actualizar la categoria, ${err.error.msg}`);
        })
      }
    })
  }

  deleteCategoria(id: number) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de eliminar la categoria?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._categoriaservice.deleteCategoria(id).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.listarCategorias()
        }, err => {
          this.toastr.error(`Ocurrio un error al eliminar la categoria, ${err.error.msg}`);
        })
      }
    })
  }

  changeStatus(id: any) {
    this._categoriaservice.changeStatus(id).subscribe(rta => {
      this.toastr.success(rta.msg);
      this.listarCategorias()
    }, err => {
      this.toastr.error(`Ocurrio un error al cambiar el estado el usuario, ${err.error.msg}`);
    })
  }


  isFieldValid(field: string) {
    if (this.formCategoria.get(field)?.touched || this.formCategoria.get(field)?.dirty) {
      if (!this.formCategoria.get(field)?.valid) {
        return 'is-invalid'
      } else {
        return 'is-valid'
      }
    } else
      return ''
  }

  getErrorMsg(field: string) {
    if (!this.formCategoria.controls[field].valid) {
      if (this.formCategoria.get(field)?.errors?.['required'])
        return `El campo es obligatorio`
      if (this.formCategoria.get(field)?.errors?.['minlength'])
        return `El campo debe tener al menos ${this.formCategoria.get(field)?.errors?.['minlength'].requiredLength} caracteres`
      if (this.formCategoria.get(field)?.errors?.['maxlength'])
        return `El campo no debe tener mas de ${this.formCategoria.get(field)?.errors?.['maxlength'].requiredLength} caracteres`
      return 'error no controlado'
    } else
      return ''
  }

}

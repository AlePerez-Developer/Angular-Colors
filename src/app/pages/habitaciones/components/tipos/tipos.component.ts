import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoHabitacion } from '../../models/TipoHabitacion';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { TipoHabitacionService } from '../../services/tipohabitacion.service';
import { TipoInterface } from '../../interfaces/tipo.interface';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tipos',
  templateUrl: './tipos.component.html',
  styleUrls: ['./tipos.component.css']
})

export class TiposComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  titulo: string
  btnstatus: boolean

  formTipo: FormGroup

  dataSource!: MatTableDataSource<TipoHabitacion>;
  displayedColumns = ['position', 'Descripcion', 'estado', 'acciones'];


  constructor(private fb: FormBuilder, private toastr: ToastrService, private _tipohabitacionservice: TipoHabitacionService) {
    this.titulo = 'Nuevo Tipo'
    this.btnstatus = false

    this.formTipo = this.fb.group({
      codigo: '',
      Descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
    })    
  }

  ngOnInit(): void {
    this.listarTipos()
  }

  listarTipos() {
    this._tipohabitacionservice.getTipos().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);

      this.dataSource.filterPredicate = function (data, filter: string): boolean {
        return data.Descripcion.toLowerCase().includes(filter);
      };

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      this.toastr.error(`No se pudo listar los tipos de habitacion registrados, ${err.error.msg}`);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  newTipoClick() {
    this.titulo = 'Nuevo tipo de habitacion'
    this.btnstatus = !this.btnstatus;
    this.formTipo.reset()
  }


  getTipo(id: number) {
    this.newTipoClick();
    this.titulo = 'Actualizar tipo habitacion'
    this._tipohabitacionservice.getTipo(id).subscribe(data => {
      this.formTipo.setValue({
        codigo: id,
        Descripcion: data.Descripcion,
      })
    }, err => {
      this.toastr.error(`No se pudo recuperar los datos del tipo de habitacion, ${err.error.msg}`);
    })
  }


  procesarGuardado() {
    const tipoInterface: TipoInterface = {
      Descripcion: this.formTipo.controls['Descripcion'].value,
    }

    if (!this.formTipo.controls['codigo'].value)
      this.agregartipo(tipoInterface)
    else
      this.actualizartipo(tipoInterface, this.formTipo.controls['codigo'].value)
  }


  agregartipo(tipohabitacion: TipoInterface) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de registrar el nuevo tipo de habitacion?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._tipohabitacionservice.addNewTipo(tipohabitacion).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.newTipoClick();
          this.listarTipos()
        }, err => {
          this.toastr.error(`Ocurrio un error al agregar el tipo de habitacion, ${err.error.msg}`);
        })
      }
    })
  }

  actualizartipo(tipohabitacion: TipoInterface, id: number) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de actualizar el tipo de habitacion?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._tipohabitacionservice.updateTipo(tipohabitacion, id).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.newTipoClick();
          this.listarTipos()
        }, err => {
          this.toastr.error(`Ocurrio un error al actualizar el tipo de habitacion, ${err.error.msg}`);
        })
      }
    })
  }

  deleteTipo(id: number) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de eliminar el tipo de habitacion?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._tipohabitacionservice.deleteTipo(id).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.listarTipos()
        }, err => {
          this.toastr.error(`Ocurrio un error al eliminar el tipo de habitacion, ${err.error.msg}`);
        })
      }
    })
  }

  changeStatus(id: any) {
    this._tipohabitacionservice.changeStatus(id).subscribe(rta => {
      this.toastr.success(rta.msg);
      this.listarTipos()
    }, err => {
      this.toastr.error(`Ocurrio un error al cambiar el estado del tipo de habitacion, ${err.error.msg}`);
    })
  }


  isFieldValid(field: string) {
    if (this.formTipo.get(field)?.touched || this.formTipo.get(field)?.dirty) {
      if (!this.formTipo.get(field)?.valid) {
        return 'is-invalid'
      } else {
        return 'is-valid'
      }
    } else
      return ''
  }

  getErrorMsg(field: string) {
    if (!this.formTipo.controls[field].valid) {
      if (this.formTipo.get(field)?.errors?.['required'])
        return `El campo es obligatorio`
      if (this.formTipo.get(field)?.errors?.['minlength'])
        return `El campo debe tener al menos ${this.formTipo.get(field)?.errors?.['minlength'].requiredLength} caracteres`
      if (this.formTipo.get(field)?.errors?.['maxlength'])
        return `El campo no debe tener mas de ${this.formTipo.get(field)?.errors?.['maxlength'].requiredLength} caracteres`
      return 'error no controlado'
    } else
      return ''
  }
}

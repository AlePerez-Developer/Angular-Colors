import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Habitacion } from '../../models/Habitacion';
import { TipoHabitacion } from '../../models/TipoHabitacion';

import { HabitacionInterface } from '../../interfaces/habitacion.inteface';

import { HabitacionService } from '../../services/habitacion.service';
import { TipoHabitacionService } from '../../services/tipohabitacion.service';

import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css']
})

export class HabitacionesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  titulo: string
  btnstatus: boolean

  formHabitacion: FormGroup

  listaTipos: TipoHabitacion[] = []

  dataSource!: MatTableDataSource<Habitacion>;
  displayedColumns = ['TipoHabitacion', 'Descripcion', 'WebRef', 'Color', 'estado', 'acciones'];

  constructor(private fb: FormBuilder, private toastr: ToastrService, 
    private _habitacionservice: HabitacionService, 
    private _tipohabitacionservice: TipoHabitacionService) {

    this.titulo = 'Nueva habitacion'
    this.btnstatus = false

    this.formHabitacion = this.fb.group({
      codigo: '',
      Descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      WebRef: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      TipoHabitacion: ['', [Validators.required]],
      Color: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.listarHabitaciones()
    this.listarTipos()
  }

  listarHabitaciones() {
    this._habitacionservice.getHabitaciones().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      this.toastr.error(`No se pudo listar las habitaciones registradas, ${err.error.msg}`);
    })
  }

  listarTipos() {
    this._tipohabitacionservice.getTipos().subscribe(rta => {
      this.listaTipos = rta
    }, err => {
      this.toastr.error(`No se pudo listar los tipos de habitaciones registradas, ${err.error.msg}`);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  newHabitacionClick() {
    this.titulo = 'Nueva habitacion'
    this.btnstatus = !this.btnstatus;
    this.formHabitacion.reset()
  }

  getHabitacion(id: number) {
    this.newHabitacionClick()
    this.titulo = 'Actualizar habitacion'
    this._habitacionservice.getHabitacion(id).subscribe(data => {
      this.formHabitacion.setValue({
        codigo: id,
        TipoHabitacion: data.CTipoHabitacion,
        Descripcion: data.Descripcion,
        WebRef: data.WebRef,
        Color: data.Color        
      })
    }, err => {
      this.toastr.error(`No se pudo recuperar los datos de la habitacion, ${err.error.msg}`);
    })
  }

  procesarGuardado() {
    const habitacionInterface = new HabitacionInterface(
      0,
      this.formHabitacion.controls['TipoHabitacion'].value,
      this.formHabitacion.controls['Descripcion'].value,
      this.formHabitacion.controls['WebRef'].value || '',
      this.formHabitacion.controls['Color'].value,
      'V',
    )

    if (!this.formHabitacion.controls['codigo'].value)
      this.agregarhabitacion(habitacionInterface)
    else
      this.actualizarhabitacion(habitacionInterface, this.formHabitacion.controls['codigo'].value)
  }


  agregarhabitacion(habitacion: HabitacionInterface) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de registrar la nueva habitacion?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._habitacionservice.addNewHabitacion(habitacion).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.newHabitacionClick()
          this.listarHabitaciones()
        }, err => {
          this.toastr.error(`Ocurrio un error al agregar la nueva habitacion, ${err.error.msg}`);
        })
      }
    })
  }

  actualizarhabitacion(habitacion: HabitacionInterface, id: number) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de actualizar la habitacion?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._habitacionservice.updateHabitacion(habitacion, id).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.newHabitacionClick()
          this.listarHabitaciones()
        }, err => {
          this.toastr.error(`Ocurrio un error al actualizar la habitacion, ${err.error.msg}`);
        })
      }
    })
  }

  deleteHabitacion(id: number) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de eliminar la habitacion?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._habitacionservice.deleteHabitacion(id).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.listarHabitaciones()
        }, err => {
          this.toastr.error(`Ocurrio un error al eliminar la habitacion, ${err.error.msg}`);
        })
      }
    })
  }

  changeStatus(id: any) {
    this._habitacionservice.changeStatus(id).subscribe(rta => {
      this.toastr.success(rta.msg);
      this.listarHabitaciones()
    }, err => {
      this.toastr.error(`Ocurrio un error al cambiar el estado de la habitacion, ${err.error.msg}`);
    })
  }

  isFieldValid(field: string) {
    if (this.formHabitacion.get(field)?.touched || this.formHabitacion.get(field)?.dirty) {
      if (!this.formHabitacion.get(field)?.valid) {
        return 'is-invalid'
      } else {
        return 'is-valid'
      }
    } else
      return ''
  }

  getErrorMsg(field: string) {
    if (!this.formHabitacion.controls[field].valid) {
      if (this.formHabitacion.get(field)?.errors?.['required'])
        return `El campo es obligatorio`
      if (this.formHabitacion.get(field)?.errors?.['minlength'])
        return `El campo debe tener al menos ${this.formHabitacion.get(field)?.errors?.['minlength'].requiredLength} caracteres`
      if (this.formHabitacion.get(field)?.errors?.['maxlength'])
        return `El campo no debe tener mas de ${this.formHabitacion.get(field)?.errors?.['maxlength'].requiredLength} caracteres`
      return 'error no controlado'
    } else
      return ''
  }
}
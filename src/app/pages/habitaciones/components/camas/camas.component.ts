import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { CamaInterface } from '../../interfaces/cama.interface';
import { HabitacionInterface } from '../../interfaces/habitacion.inteface';

import { CamaService } from '../../services/cama.service';
import { HabitacionService } from '../../services/habitacion.service';

@Component({
  selector: 'app-camas',
  templateUrl: './camas.component.html',
  styleUrls: ['./camas.component.css']
})

export class CamasComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  titulo: string
  btnstatus: boolean
  tituloDD: string
  habitacionElegida: number

  formCama: FormGroup

  listaHabitaciones: HabitacionInterface[] = []

  dataSource!: MatTableDataSource<CamaInterface>;
  displayedColumns = ['Habitacion', 'Descripcion', 'Precio', 'Color', 'estado', 'acciones'];

  constructor(private fb: FormBuilder, private toastr: ToastrService, 
    private _camaservice: CamaService, 
    private _habitacionservice: HabitacionService) {

    this.titulo = 'Nueva cama'
    this.btnstatus = false
    this.tituloDD = 'Todas'
    this.habitacionElegida = 0

    this.formCama = this.fb.group({
      codigo: '',
      Descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      Precio: ['', [Validators.required]],
      Color: ['', [Validators.required]],
      Habitacion: ['', [Validators.required]]
    })
  }

  cambio(codigo: number, descripcion: string){
    this.tituloDD = descripcion
    this.habitacionElegida = codigo
    this.listarCamas(codigo)
  }

  ngOnInit(): void {
    this.listarCamas(0)
    this.listarHabitaciones()
  }

  listarCamas(forma: number) {
    if (forma === 0) {
      this._camaservice.getCamas().subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, err => {
        this.toastr.error(`No se pudo listar las camas registradas, ${err.error.msg}`);
      })
    } else {
      this._camaservice.getCamasbyHabitacion(forma).subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, err => {
        this.toastr.error(`No se pudo listar las camas registradas, ${err.error.msg}`);
      })
    }    
  }

  listarHabitaciones() {
    this._habitacionservice.getHabitaciones().subscribe(data => {
      this.listaHabitaciones = data
    }, err => {
      this.toastr.error(`No se pudo listar las habitaciones registradas, ${err.error.msg}`);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  newCamaClick() {
    this.titulo = 'Nueva cama'
    this.btnstatus = !this.btnstatus;
    this.formCama.reset()
  }

  getCama(id: number) {
    this.newCamaClick()
    this.titulo = 'Actualizar cama'
    this._camaservice.getCama(id).subscribe(data => {
      this.formCama.setValue({
        codigo: id,
        Habitacion: data.CHabitacion,
        Descripcion: data.Descripcion,
        Precio: data.Precio,
        Color: data.Color
      })
    }, err => {
      this.toastr.error(`No se pudo recuperar los datos de la cama, ${err.error.msg}`);
    })
  }

  procesarGuardado() {
    const camaInterface = new CamaInterface(
      0,
      this.formCama.controls['Habitacion'].value,
      this.formCama.controls['Descripcion'].value,
      this.formCama.controls['Precio'].value || '',
      this.formCama.controls['Color'].value,
      'V'
    )

    if (!this.formCama.controls['codigo'].value)
      this.agregarCama(camaInterface)
    else
      this.actualizarCama(camaInterface, this.formCama.controls['codigo'].value)
  }


  agregarCama(cama: CamaInterface) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de registrar la nueva cama?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._camaservice.addNewCama(cama).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.newCamaClick()
          this.listarCamas(this.habitacionElegida)
        }, err => {
          this.toastr.error(`Ocurrio un error al agregar la nueva cama, ${err.error.msg}`);
        })
      }
    })
  }

  actualizarCama(cama: CamaInterface, id: number) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de actualizar la cama?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._camaservice.updateCama(cama, id).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.newCamaClick()
          this.listarCamas(this.habitacionElegida)
        }, err => {
          this.toastr.error(`Ocurrio un error al actualizar la cama, ${err.error.msg}`);
        })
      }
    })
  }

  deleteCama(id: number) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de eliminar la cama?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._camaservice.deleteCama(id).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.listarCamas(this.habitacionElegida)
        }, err => {
          this.toastr.error(`Ocurrio un error al eliminar la cama, ${err.error.msg}`);
        })
      }
    })
  }

  changeStatus(id: any) {
    this._camaservice.changeStatus(id).subscribe(rta => {
      this.toastr.success(rta.msg);
      this.listarCamas(this.habitacionElegida)
    }, err => {
      this.toastr.error(`Ocurrio un error al cambiar el estado de la cama, ${err.error.msg}`);
    })
  }

  isFieldValid(field: string) {
    if (this.formCama.get(field)?.touched || this.formCama.get(field)?.dirty) {
      if (!this.formCama.get(field)?.valid) {
        return 'is-invalid'
      } else {
        return 'is-valid'
      }
    } else
      return ''
  }

  getErrorMsg(field: string) {
    if (!this.formCama.controls[field].valid) {
      if (this.formCama.get(field)?.errors?.['required'])
        return `El campo es obligatorio`
      if (this.formCama.get(field)?.errors?.['minlength'])
        return `El campo debe tener al menos ${this.formCama.get(field)?.errors?.['minlength'].requiredLength} caracteres`
      if (this.formCama.get(field)?.errors?.['maxlength'])
        return `El campo no debe tener mas de ${this.formCama.get(field)?.errors?.['maxlength'].requiredLength} caracteres`
      return 'error no controlado'
    } else
      return ''
  }
}
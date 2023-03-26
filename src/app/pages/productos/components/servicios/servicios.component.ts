import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ServicioInterface } from '../../interfaces/servicio.interface';
import { ServicioService } from '../../services/servicio.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})

export class ServiciosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  titulo: string
  btnstatus: boolean

  formServicio: FormGroup

  dataSource!: MatTableDataSource<ServicioInterface>;
  displayedColumns = ['position', 'Nombre', 'Descripcion', 'Medida', 'PrecioUnitario', 'estado', 'acciones'];

  constructor(private fb: FormBuilder, private toastr: ToastrService, private _servicioservice: ServicioService) {
    this.titulo = 'Nuevo Servicio'
    this.btnstatus = false

    this.formServicio = this.fb.group({
      codigo: '',
      Nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      Descripcion: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      Medida: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      PrecioUnitario: ['', [Validators.required]],
    })
  }
 
  ngOnInit(): void {
    this.listarServicios()
  }

  listarServicios() {
    this._servicioservice.getServicios().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      this.toastr.error(`No se pudo listar los servicios registrados, ${err}`);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  newServClick() {
    this.titulo = 'Nuevo Producto'
    this.btnstatus = !this.btnstatus;
    this.formServicio.reset()
  }

  getServicio(id: number) {
    this.newServClick()
    this.titulo = 'Actualizar Servicio'
    this._servicioservice.getServicio(id).subscribe(servicio => {
      this.formServicio.setValue({
        codigo: id,
        Nombre: servicio.Nombre,
        Descripcion: servicio.Descripcion,
        Medida: servicio.Medida,
        PrecioUnitario: servicio.PrecioUnitario
      })
    }, err => {
      this.toastr.error(`No se pudo recuperar los datos del servicio, ${err.error.msg}`);
    })
  }

  procesarGuardado() {
    const servicioInterface = new  ServicioInterface(
      0,
      this.formServicio.controls['Nombre'].value,
      this.formServicio.controls['Descripcion'].value,
      this.formServicio.controls['Medida'].value || '',
      this.formServicio.controls['PrecioUnitario'].value,
      'V'
    )
    if (!this.formServicio.controls['codigo'].value)
      this.agregarServicio(servicioInterface)
    else
      this.actualizarServicio(servicioInterface, this.formServicio.controls['codigo'].value)
  }

  agregarServicio(servicio: ServicioInterface) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de registrar el nuevo servicio?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._servicioservice.addNewServicio(servicio).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.newServClick()
          this.listarServicios()
        }, err => {
          this.toastr.error(`Ocurrio un error al agregar el servicio, ${err.error.msg}`);
        })
      }
    })
  }

  actualizarServicio(servicio: ServicioInterface, id: number) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de actualizar el servicio?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._servicioservice.updateServicio(servicio, id).subscribe((rta: any )=> {
          this.toastr.success(rta.msg);
          this.newServClick()
          this.listarServicios()
        }, err => {
          this.toastr.error(`Ocurrio un error al actualizar el servicio, ${err.error.msg}`);
        })
      }
    })
  }

  deleteServicio(id: number) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de eliminar el servicio?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._servicioservice.deleteServicio(id).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.listarServicios()
        }, err => {
          this.toastr.error(`Ocurrio un error al eliminar el servicio, ${err.error.msg}`);
        })
      }
    })
  }

  changeStatus(id: any) {
    this._servicioservice.changeStatus(id).subscribe(rta => {
      this.toastr.success(rta.msg);
      this.listarServicios()
    }, err => {
      this.toastr.error(`Ocurrio un error al cambiar el estado el servicio, ${err.error.msg}`);
    })
  }

  isFieldValid(field: string) {
    if (this.formServicio.get(field)?.touched || this.formServicio.get(field)?.dirty) {
      if (!this.formServicio.get(field)?.valid) {
        return 'is-invalid'
      } else {
        return 'is-valid'
      }
    } else
      return ''
  }

  getErrorMsg(field: string) {
    if (!this.formServicio.controls[field].valid) {
      if (this.formServicio.get(field)?.errors?.['required'])
        return `El campo es obligatorio`
      if (this.formServicio.get(field)?.errors?.['minlength'])
        return `El campo debe tener al menos ${this.formServicio.get(field)?.errors?.['minlength'].requiredLength} caracteres`
      if (this.formServicio.get(field)?.errors?.['maxlength'])
        return `El campo no debe tener mas de ${this.formServicio.get(field)?.errors?.['maxlength'].requiredLength} caracteres`
      return 'error no controlado'
    } else
      return ''
  }
}

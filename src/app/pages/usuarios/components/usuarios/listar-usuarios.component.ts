import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { Usuario } from '../../models/Usuario';
import { UsrInterface } from '../../interfaces/usuario.interface';
import { UsuarioService } from "../../services/usuario.service";

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.css']
})

export class ListarUsuariosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  titulo: string
  btnstatus: boolean

  formUsuario: FormGroup

  dataSource!: MatTableDataSource<UsrInterface>;
  displayedColumns = ['Login', 'Ci', 'NombreCompleto', 'Rol', 'estado', 'acciones'];

  constructor(private fb: FormBuilder, private toastr: ToastrService, private _usuarioservice: UsuarioService) {
    this.titulo = 'Nuevo Usuario'
    this.btnstatus = false

    this.formUsuario = this.fb.group({
      codigo: '',
      IdPersona: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(14)]],
      Expedido: ['', [Validators.required]],
      Complemento: [''],
      Nombres: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(200)]],
      APaterno: ['', [Validators.minLength(3), Validators.maxLength(200)]],
      AMaterno: ['', [Validators.minLength(3), Validators.maxLength(200)]],
      Login: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(200)]],
      Pswd: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(200)]],
      P2: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(200)]],
    },
    { validators: this.MatchPswdValidator })
  }

  MatchPswdValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const name = control.get('Pswd');
    const alterEgo = control.get('P2');
  
    return name && alterEgo && name.value !== alterEgo.value ? { PswdMatchError: true } : null;
  };
  
  ngOnInit(): void {
    this.listarUsuarios()
  }

  listarUsuarios() {
    this._usuarioservice.getUsuarios().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => {
      this.toastr.error(`No se pudo listar los usuarios registrados, ${err.error.msg}`);
      console.log(err)
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  newUsrClick() {
    this.titulo = 'Nuevo Usuario'
    this.btnstatus = !this.btnstatus;
    this.formUsuario.reset()
  }

  getUsuario(id: number) {
    this.newUsrClick()
    this.titulo = 'Actualizar Usuario'
    this._usuarioservice.getUSuario(id).subscribe(usuario => {
      usuario = usuario.usuario
      this.formUsuario.setValue({
        codigo: id,
        IdPersona: usuario.Persona.IdPersona,
        Expedido: usuario.Persona.Expedido,
        Complemento: usuario.Persona.Complemento,
        Nombres: usuario.Persona.Nombres,
        APaterno: usuario.Persona.APaterno,
        AMaterno: usuario.Persona.AMaterno,
        Login: usuario.Login,
        Pswd: 'samepass',
        P2: 'samepass',
      })
    }, err => {
      this.toastr.error(`No se pudo recuperar los datos del usuario, ${err.error.msg}`);
    })
  }

  procesarGuardado() {
    const usrInterface = new  UsrInterface(
      0,
      this.formUsuario.controls['IdPersona'].value,
      this.formUsuario.controls['Expedido'].value,
      this.formUsuario.controls['Complemento'].value || '',
      this.formUsuario.controls['Nombres'].value,
      this.formUsuario.controls['APaterno'].value || '',
      this.formUsuario.controls['AMaterno'].value || '',
      this.formUsuario.controls['Login'].value, 
      '',
      this.formUsuario.controls['Pswd'].value,
      ''
    )
    if (!this.formUsuario.controls['codigo'].value)
      this.agregarusuario(usrInterface)
    else
      this.actualizarusuario(usrInterface, this.formUsuario.controls['codigo'].value)
  }

  agregarusuario(usuario: UsrInterface) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de registrar el nuevo usuario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._usuarioservice.addNewUsuario(usuario).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.newUsrClick()
          this.listarUsuarios()
        }, err => {
          this.toastr.error(`Ocurrio un error al agregar el usuario, ${err.error.msg}`);
        })
      }
    })
  }

  actualizarusuario(usuario: UsrInterface, id: number) {
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
        this._usuarioservice.updateUsuario(usuario, id).subscribe((rta: any )=> {
          this.toastr.success(rta.msg);
          this.newUsrClick()
          this.listarUsuarios()
        }, err => {
          this.toastr.error(`Ocurrio un error al actualizar el usuario, ${err.error.msg}`);
        })
      }
    })
  }

  deleteUSuario(id: number) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de eliminar el usuario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._usuarioservice.deleteUsuario(id).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.listarUsuarios()
        }, err => {
          this.toastr.error(`Ocurrio un error al eliminar el usuario, ${err.error.msg}`);
        })
      }
    })
  }

  changeStatus(id: any) {
    this._usuarioservice.changeStatus(id).subscribe(rta => {
      this.toastr.success(rta.msg);
      this.listarUsuarios()
    }, err => {
      this.toastr.error(`Ocurrio un error al cambiar el estado el usuario, ${err.error.msg}`);
    })
  }


  isFieldValid(field: string) {
    if (this.formUsuario.get(field)?.touched || this.formUsuario.get(field)?.dirty) {
      if (!this.formUsuario.get(field)?.valid) {
        return 'is-invalid'
      } else {
        return 'is-valid'
      }
    } else
      return ''
  }

  getErrorMsg(field: string) {
    if (!this.formUsuario.controls[field].valid) {
      if (this.formUsuario.get(field)?.errors?.['required'])
        return `El campo es obligatorio`
      if (this.formUsuario.get(field)?.errors?.['minlength'])
        return `El campo debe tener al menos ${this.formUsuario.get(field)?.errors?.['minlength'].requiredLength} caracteres`
      if (this.formUsuario.get(field)?.errors?.['maxlength'])
        return `El campo no debe tener mas de ${this.formUsuario.get(field)?.errors?.['maxlength'].requiredLength} caracteres`
      return 'error no controlado'
    } else
      return ''
  }
}
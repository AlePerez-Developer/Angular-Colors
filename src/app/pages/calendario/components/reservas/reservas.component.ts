import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { HabitacionInterface } from 'src/app/pages/habitaciones/interfaces/habitacion.inteface';
import { PersonaInterface } from 'src/app/pages/usuarios/interfaces/persona.interface';
import { CamaInterface } from 'src/app/pages/habitaciones/interfaces/cama.interface';
import { ReservaInterface } from '../../interfaces/reserva.interface';

import { HabitacionService } from 'src/app/pages/habitaciones/services/habitacion.service';
import { PersonaService } from 'src/app/pages/usuarios/services/persona.service';
import { CamaService } from 'src/app/pages/habitaciones/services/cama.service';
import { ReservaService } from '../../services/reserva.service';

import {
  View,
  GroupModel,
  DayService,
  WeekService,
  MonthService,
  ResourceDetails,
  EventSettingsModel,
  ScheduleComponent,
  EventRenderedArgs,
  PopupOpenEventArgs,
  ActionEventArgs,
  CurrentAction,
  TimelineViewsService, TimelineMonthService,
} from '@syncfusion/ej2-angular-schedule';
import { extend } from '@syncfusion/ej2-base';
@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
  providers: [DayService, WeekService, MonthService, TimelineViewsService, TimelineMonthService]
})

export class ReservasComponent implements OnInit {
  @ViewChild('scheduleObj') scheduleObj!: ScheduleComponent;
  @ViewChild('reservas') ModalRef!: NgbModal;
  @ViewChild('checkin') ModalCheckIn!: NgbModal;

  dropdowntitle = 'Seleccione la habitacion'
  habitacionelegida: boolean = false
  Elegido: boolean = false
  Edicion: boolean = false

  listaHabitaciones: HabitacionInterface[] = []
  listaReservas: Record<string, any>[] = []
  listaPersonas: PersonaInterface[] = []
  listaCamas: CamaInterface[] = []

  formReserva: FormGroup
  formPersona: FormGroup
  buscarPersona = new FormControl<string | PersonaInterface>('');
  filteredOptions!: Observable<PersonaInterface[]>;

  cuarto: number = 0
  persona: number = 0
  public selectedDate: Date = new Date();


  public data: Record<string, any>[] = extend([], this.listaReservas, '', true) as Record<string, any>[];
  public currentView: View = 'TimelineMonth';
  public employeeDataSource: Record<string, any>[] = [];
  public group: GroupModel = { enableCompactView: false, resources: ['Employee'] };
  public allowMultiple = false;
  public eventSettings: EventSettingsModel = { dataSource: this.data };

  public getEmployeeName(value: ResourceDetails): string {
    //console.log((value as ResourceDetails).resourceData)
    return (value as ResourceDetails).resourceData['Text'] as string;
  }

  public getEmployeeDesignation(value: ResourceDetails): string {
    return 'Precio: ' + (value as ResourceDetails).resourceData['Designation'] as string + ' Bs.';
  }

  public getcolor(value: ResourceDetails): string{
    return (value as ResourceDetails).resourceData['Color'] as string;
  }

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _habitacionesservice: HabitacionService,
    private _camasservices: CamaService,
    private _reservasservice: ReservaService,
    private _personasservice: PersonaService,
    private _modalservice: NgbModal,) {

    this.formReserva = this.fb.group({
      codigo: '',
      Persona: ['', [Validators.required]],
      Cama: ['', [Validators.required]],
      Procedencia: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      WebRef: ['', [Validators.minLength(2), Validators.maxLength(200)]],
      FechaInicio: ['', [Validators.required]],
      FechaFin: ['', [Validators.required]]
    })

    this.formPersona = this.fb.group({
      codigo: '',
      IdPersona: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      Complemento: ['', [Validators.maxLength(5)]],
      Expedido: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      APaterno: ['', [Validators.maxLength(100)]],
      AMaterno: ['', [Validators.maxLength(100)]],
      Nombres: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    })
  }

  ngOnInit(): void {
    this.listarHabitaciones()
    this.listarPersonas()

    this.filteredOptions = this.buscarPersona.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.NombreCompleto;
        return name ? this._filter(name as string) : this.listaPersonas.slice();
      }),
    )
  }

  listarHabitaciones() {
    this._habitacionesservice.getHabitaciones().subscribe(data => {
      this.listaHabitaciones = data
    }, err => {
      this.toastr.error(`No se pudo listar las habitaciones registradas, ${err.error.msg}`);
    })
  }

  listarPersonas() {
    this._personasservice.getPersonas().subscribe(data => {
      this.listaPersonas = data
    }, err => {
      this.toastr.error(`No se pudo listar las persona registradas, ${err.error.msg}`);
    })
  }

  cambiarHabitacion(codigoHabitacion: number) {
    this._habitacionesservice.getHabitacion(codigoHabitacion).subscribe(data => {
      this.dropdowntitle = `Habitacion: ${data.Descripcion}`
      this.habitacionelegida = true
      this.cuarto = codigoHabitacion
      this.listarCamas(data.CodigoHabitacion)
    }, err => {
      this.toastr.error(`No se pudo cargar la habitacion seleccionada, ${err.error.msg}`);
    })
  }

  listarCamas(codigoHabitacion: number) {
    this.listaReservas = []
    this.employeeDataSource = []

    this._camasservices.getCamasbyHabitacion(codigoHabitacion).subscribe(camas => {
      this.listaCamas = camas
      camas.forEach((data, index) => {
        this.employeeDataSource.push({
          Text: data.Descripcion,
          Id: data.Codigo,
          GroupId: data.Estado,
          Color: data.Color,
          Designation: data.Precio,
        })

        this._reservasservice.getReservasByCama(data.Codigo).subscribe(reservas => {
          reservas.forEach((data) => {
            let llegada = new Date(data.FechaInicio);
            llegada.setHours(llegada.getHours() + 5);
            var salida = new Date(data.FechaFin);
            salida.setHours(salida.getHours() + 5);

            this.listaReservas.push({
              Id: data.Codigo,
              Subject: data.Persona,
              Location: data.Cama,
              Description: data.LugarProcedencia,
              StartTime: llegada,
              EndTime: salida,
              IsAllDay: true,
              Estado: data.Estado,
              EmployeeId: data.CodigoCama,
            })
          })
        }, err => {
          this.toastr.error(`No se pudo listar las reservas registradas, ${err.error.msg}`);
        })
      })
      this.scheduleObj.eventSettings.dataSource = this.listaReservas
      this.scheduleObj.refresh()
      this.scheduleObj.refreshLayout();
    }, err => {
      this.toastr.error(`No se pudo listar las camas registradas, ${err.error.msg}`);
    })
  }

  cargarPersona(id: number) {
    this._personasservice.getPersona(id).subscribe(data => {
      this.formPersona.reset()
      this.formPersona.setValue({
        codigo: id,
        IdPersona: data.IdPersona,
        Complemento: data.Complemento,
        Expedido: data.Expedido,
        APaterno: data.APaterno,
        AMaterno: data.AMaterno,
        Nombres: data.Nombres
      })
      this.formPersona.disable()
      this.Elegido = true
      this.Edicion = false
      this.persona = id
    }, err => {
      this.toastr.error(`No se pudo recuperar los datos de la persona, ${err.error.msg}`);
    })
  }

  cargarReserva(reserva: any) {
    let llegada = new Date(reserva.FechaInicio);
    llegada.setHours(llegada.getHours() + 5);
    this.formReserva.setValue({
      codigo: reserva.CodigoReserva,
      Persona: reserva.CPersona,
      Cama: reserva.CCama,
      Procedencia: reserva.LugarProcedencia,
      WebRef: reserva.RefWeb,
      FechaInicio: llegada,
      FechaFin: new Date(new Date(reserva.FechaFin).toISOString().slice(0, -1))
    })
    this.formReserva.controls['Cama'].disable();
  }

  procesarGuardado() {
    this.formPersona.markAllAsTouched()

    if (this.formPersona.valid) {
      const personaInterface = new PersonaInterface(
        0,
        this.formPersona.controls['IdPersona'].value,  //this.formPersona.controls['IdPersona'],
        this.formPersona.controls['Expedido'].value,
        this.formPersona.controls['Complemento'].value,
        this.formPersona.controls['Nombres'].value,
        this.formPersona.controls['APaterno'].value,
        this.formPersona.controls['AMaterno'].value,
        'V'
      )
      if (!this.formPersona.controls['codigo'].value)
        this.agregarpersona(personaInterface)
      else
        this.actualizarpersona(personaInterface, this.formPersona.controls['codigo'].value)
    }
  }

  agregarpersona(persona: PersonaInterface) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de registrar la nueva persona?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._personasservice.addNewPersona(persona).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.listarPersonas()
          this.cargarPersona(rta.id)
        }, err => {
          this.toastr.error(`Ocurrio un error al agregar la nueva persona, ${err.error.msg}`);
        })
      }
    })
  }

  actualizarpersona(persona: PersonaInterface, id: number) {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de actualizar los datos de la persona?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._personasservice.updatePersona(persona, id).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.cargarPersona(id)
        }, err => {
          this.toastr.error(`Ocurrio un error al actualizar la persona, ${err.error.msg}`);
        })
      }
    })
  }

  registrarReserva() {
    this.formReserva.markAllAsTouched()
    this.formReserva.patchValue({
      Persona: this.persona
    })
    if (this.formReserva.valid) {
      if (this.formReserva.controls['codigo'].value) {
        const reservaInterface = new ReservaInterface(
          this.formReserva.controls['codigo'].value,
          this.formReserva.controls['Cama'].value,
          this.persona.toString(),  //this.formPersona.controls['IdPersona'],
          this.formReserva.controls['Cama'].value,
          this.formReserva.controls['Procedencia'].value,
          '',
          this.formReserva.controls['FechaInicio'].value,
          this.formReserva.controls['FechaFin'].value,
          'R'
        )
        this._reservasservice.updateReserva(reservaInterface, this.formReserva.controls['codigo'].value).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.listarCamas(this.cuarto)
          this._modalservice.dismissAll()
        }, err => {
          this.toastr.error(`Ocurrio un error al actualizar la reserva, ${err.error.msg}`);
        })

      } else {
        if (this.persona != 0)
          this.formReserva.patchValue({
            Persona: this.persona
          })

        const reservaInterface = new ReservaInterface(
          0,
          0,
          this.persona.toString(),  //this.formPersona.controls['IdPersona'],
          this.formReserva.controls['Cama'].value,
          this.formReserva.controls['Procedencia'].value,
          '',
          this.formReserva.controls['FechaInicio'].value,
          this.formReserva.controls['FechaFin'].value,
          'R'
        )

        this._reservasservice.addNewReserva(reservaInterface).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.listarCamas(this.cuarto)
          this._modalservice.dismissAll()
        }, err => {
          this.toastr.error(`Ocurrio un error al registrar la reserva, ${err.error.msg}`);
        })

      }
    }
  }

  AbrirCheckIn(id: number) {
    this._reservasservice.getReservasById(id).subscribe(data => {
      this.cargarPersona(data.Persona.CodigoPersona)
      this.cargarReserva(data)
      this._modalservice.open(this.ModalCheckIn, { size: 'lg', backdrop: true, backdropClass: 'light-blue-backdrop', centered: true });
    }, err => {
      this.toastr.error(`No se pudo listar las camas registradas, ${err.error.msg}`);
    })
  }


  onPopupOpen(args: PopupOpenEventArgs): void {
    switch (args.type as string) {
      case 'QuickInfo': {
        if (args.target!.className.search('cell') > 0) {
          args.cancel = true
        }
        break
      }
      case 'Editor': {
        args.cancel = true;
        if (args.data!['Id']) {
          this._reservasservice.getReservasById(args.data!['Id']).subscribe(data => {
            this.cargarPersona(data.Persona.CodigoPersona)
            this.cargarReserva(data)
            this._modalservice.open(this.ModalRef, { size: 'lg', backdrop: true, backdropClass: 'light-blue-backdrop', centered: true });
          }, err => {
            this.toastr.error(`No se pudo listar las camas registradas, ${err.error.msg}`);
          })
        } else {
          this.buscarPersona.reset()
          this.formPersona.reset()
          this.formReserva.reset()
          this.formPersona.disable()
          this.Edicion = false
          this.formReserva.patchValue({
            Cama: args.data!['EmployeeId'],
            FechaInicio: new Date(args.data!['StartTime'])
          })
          this.formReserva.controls['Cama'].disable();
          this._modalservice.open(this.ModalRef, { size: 'lg', backdrop: true, backdropClass: 'light-blue-backdrop', centered: true });
        }
        break
      }
      case 'DeleteAlert': {
        args.cancel = true
        Swal.fire({
          title: 'Confirmacion',
          text: "¿Está seguro de eliminar la reserva?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '<i class="fa fa-check-circle-o"></i> Si, eliminar',
          cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this._reservasservice.deleteReserva(args.data!['Id']).subscribe(rta => {
              this.toastr.success(rta.msg);
              this.listarCamas(this.cuarto)
            }, err => {
              this.toastr.error(`Ocurrio un error al eliminar la reserva, ${err.error.msg}`);
            })
          }
        })
        break
      }
      default: {
        args.cancel = true
        break
      }
    }
  }

  public onEventRendered(args: EventRenderedArgs): void {
    if (args.data['Estado'] as string === 'R') {
      args.element.style.backgroundColor = '#c5beb8'
    } else {
      //args.element.style.backgroundColor = 'black'
      console.log(args)
    }
  }

  displayFn(persona: PersonaInterface): string {
    return persona && persona.NombreCompleto ? persona.NombreCompleto : '';
  }

  _filter(name: string): PersonaInterface[] {
    const filterValue = name.toLowerCase();
    return this.listaPersonas.filter(option => option.NombreCompleto.toLowerCase().includes(filterValue));
  }

  isFieldValidPersona(field: string) {
    if (this.formPersona.get(field)?.touched || this.formPersona.get(field)?.dirty) {
      if (!this.formPersona.get(field)?.valid) {
        return 'is-invalid'
      } else {
        return 'is-valid'
      }
    } else
      return ''
  }

  isFieldValidReserva(field: string) {
    if (this.formReserva.get(field)?.touched || this.formReserva.get(field)?.dirty) {
      if (!this.formReserva.get(field)?.valid) {
        return 'is-invalid'
      } else {
        return 'is-valid'
      }
    } else
      return ''
  }

  getErrorMsgPersona(field: string) {
    if (!this.formPersona.controls[field].valid) {
      if (this.formPersona.get(field)?.errors?.['required'])
        return `El campo es obligatorio`
      if (this.formPersona.get(field)?.errors?.['minlength'])
        return `El campo debe tener al menos ${this.formPersona.get(field)?.errors?.['minlength'].requiredLength} caracteres`
      if (this.formPersona.get(field)?.errors?.['maxlength'])
        return `El campo no debe tener mas de ${this.formPersona.get(field)?.errors?.['maxlength'].requiredLength} caracteres`
      return 'error no controlado'
    } else
      return ''
  }

  getErrorMsgReserva(field: string) {
    if (!this.formReserva.controls[field].valid) {
      if (this.formReserva.get(field)?.errors?.['required'])
        return `El campo es obligatorio`
      if (this.formReserva.get(field)?.errors?.['minlength'])
        return `El campo debe tener al menos ${this.formReserva.get(field)?.errors?.['minlength'].requiredLength} caracteres`
      if (this.formReserva.get(field)?.errors?.['maxlength'])
        return `El campo no debe tener mas de ${this.formReserva.get(field)?.errors?.['maxlength'].requiredLength} caracteres`
      return 'error no controlado'
    } else
      return ''
  }

  btnNuevoClick() {
    this.formPersona.enable()
    this.buscarPersona.reset()
    this.Elegido = false
    this.Edicion = true
  }

  btnEditClick() {
    this.formPersona.enable()
    this.Elegido = false
    this.Edicion = true
  }

  btnCancelClick() {
    this.formPersona.reset()
    this.buscarPersona.reset()
    this.formPersona.disable()
    this.Elegido = false
    this.Edicion = false
  }

  onActionBegin(args: ActionEventArgs): void {
    if (args.requestType === 'eventChange') { //while editing the existing event 

    }
    if (args.requestType === 'eventCreate') { //while creating new event 
      let reserva: ReservaInterface
      args.data!.forEach((data: { [x: string]: any; }) => {
        reserva = new ReservaInterface(0, 0, data['Subject'], data['EventType'], data['Description'], '', data['StartTime'], data['EndTime'], 'v')
      })
      this._reservasservice.addNewReserva(reserva!).subscribe(rta => {
        this.toastr.success(rta.msg);
      }, err => {
        this.toastr.error(`Ocurrio un error al agregar la nueva habitacion, ${err.error.msg}`);
      })
    }
  }

  check() {
    Swal.fire({
      title: 'Confirmacion',
      text: "¿Está seguro de realizar el check in?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="fa fa-check-circle-o"></i> Si, continuar',
      cancelButtonText: '<i class="fa fa-times-circle-o"></i> Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._reservasservice.checkin(this.formReserva.controls['codigo'].value).subscribe(rta => {
          this.toastr.success(rta.msg);
          this.listarCamas(this.cuarto)
          this._modalservice.dismissAll()
        }, err => {
          this.toastr.error(`Ocurrio un error al actualizar la reserva, ${err.error.msg}`);
        })
      }
    })

  }


}
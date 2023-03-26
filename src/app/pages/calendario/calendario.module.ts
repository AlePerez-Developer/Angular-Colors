import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarioRoutingModule } from './calendario-routing.module';
import { ReservasComponent } from './components/reservas/reservas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import {MatDatepickerModule} from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [
    ReservasComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModalModule,
    NgbDropdownModule,
    CalendarioRoutingModule,
    ScheduleModule,
    MatAutocompleteModule,MatFormFieldModule,MatInputModule, MatDatepickerModule, MatNativeDateModule
  ]
})
export class CalendarioModule { }

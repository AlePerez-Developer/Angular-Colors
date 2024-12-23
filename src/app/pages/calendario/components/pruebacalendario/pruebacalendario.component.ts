import { Component, OnInit } from '@angular/core';
import {
  EventSettingsModel, View, DayService, WeekService, WorkWeekService, MonthService, AgendaService
} from '@syncfusion/ej2-angular-schedule';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-pruebacalendario',
  templateUrl: './pruebacalendario.component.html',
  styleUrls: ['./pruebacalendario.component.css'],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService],

})
export class PruebacalendarioComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log(this.eventSettings)
  }

  public currentView: View = 'Month';
  public readonly = true;
  private dataManager: DataManager = new DataManager({
    url: 'https://services.syncfusion.com/angular/production/api/schedule',
    adaptor: new WebApiAdaptor(),
    crossDomain: true
  });

  public eventSettings: EventSettingsModel = { dataSource: this.dataManager };

}

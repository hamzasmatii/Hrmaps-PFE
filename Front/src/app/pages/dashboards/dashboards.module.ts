import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardsRoutingModule } from './dashboards-routing.module';
import { UIModule } from '../../shared/ui/ui.module';
import { WidgetModule } from '../../shared/widget/widget.module';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbDropdownModule, NgbTooltipModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular';
import { ChartsModule } from 'ng2-charts';

import { ServiceEqComponent } from './admin/components/service-eq/service-eq.component';
import { AdvancedSortableDirective } from './admin/components/service-eq/advanced-sortable.directive';
import { EmployeComponent } from './admin/components/employe/employe-list/employe.component';
import { AddEmployeComponent } from './admin/components/employe/add-employe/add-employe.component';
import { EmployeDetailComponent } from './employe/employe-detail/employe-detail.component';
import { ProfilComponent } from './chefdequipe/profil/profil.component';
import { ServiceEqDetailComponent } from './chefdequipe/service-eq-detail/service-eq-detail.component';
import { PosteComponent } from './admin/poste/poste.component';
import { PosteDetailComponent } from './admin/poste/poste-detail/poste-detail.component';
import { CalendarComponent } from './admin/components/employe/formation/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import bootstrapPlugin from "@fullcalendar/bootstrap";
import { CalandarDatailComponent } from './employe/calandar-datail/calandar-datail.component';
FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  bootstrapPlugin
]);
@NgModule({
  declarations: [   ServiceEqComponent, EmployeComponent,AdvancedSortableDirective, AddEmployeComponent, EmployeDetailComponent, ProfilComponent, ServiceEqDetailComponent, PosteComponent, PosteDetailComponent,CalendarComponent, CalandarDatailComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardsRoutingModule,
    UIModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbNavModule,
    WidgetModule,
    NgApexchartsModule,
    SimplebarAngularModule,
    CommonModule,
    UIModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbCollapseModule,
    NgbDropdownModule,
    FormsModule,
    Ng2SmartTableModule,
    ChartsModule,
    FullCalendarModule
  ]
})
export class DashboardsModule { }

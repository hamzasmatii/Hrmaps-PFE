import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarOptions, EventInput, FullCalendarComponent } from '@fullcalendar/angular';
import { Formation } from 'src/app/core/models/Formation';
import { FormationService } from 'src/app/core/services/Formation.service';

@Component({
  selector: 'app-calandar-datail',
  templateUrl: './calandar-datail.component.html',
  styleUrls: ['./calandar-datail.component.scss']
})
export class CalandarDatailComponent implements OnInit {
  @ViewChild('fullcalendar') calendarComponent: FullCalendarComponent;
  id:number;
  breadCrumbItems: Array<{}>;
  calendarOptions: CalendarOptions;


  constructor(private formationService: FormationService,private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Skote' }, { label: 'Calendar', active: true }];

    this.id = this.route.snapshot.params['id'];
    this.initializeCalendarOptions();
    this.getAllFormationForUser();
  }

  initializeCalendarOptions(): void {
    this.calendarOptions = {
      headerToolbar: {
        left: 'dayGridMonth,dayGridWeek,dayGridDay',
        center: 'title',
        right: 'prevYear,prev,next,nextYear'
      },
      initialView: "dayGridMonth",
      themeSystem: "bootstrap",
      weekends: true,
      events: [],
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        meridiem: false,
        hour12: true
      }
    };
  }

  getAllFormationForUser(): void {
    this.formationService.getFormationsByUserId(this.id).subscribe(
      (formations: Formation[]) => {
        const events: EventInput[] = formations.map(formation => ({
          id: formation.id.toString(),
          title: formation.nom || 'No Title',
          start: formation.dateDebut,
          end: formation.dateFin || formation.dateDebut,
          className: 'bg-info text-white'
        }));

        const calendarApi = this.calendarComponent.getApi();
        calendarApi.removeAllEvents();
        calendarApi.addEventSource(events);

        
      },
      error => {
        console.error('Error fetching formations:', error);
      }
    );
  }

  

}

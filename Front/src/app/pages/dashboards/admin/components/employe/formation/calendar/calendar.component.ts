import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarOptions, EventClickArg, EventApi, EventInput, FullCalendarComponent, DateInput } from '@fullcalendar/angular';
import Swal from 'sweetalert2';
import { FormationService } from 'src/app/core/services/Formation.service';
import { Formation } from 'src/app/core/models/Formation';
import { User } from 'src/app/core/models/User';
import { UserService } from 'src/app/core/services/User.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

let eventGuid = 0;
export function createEventId() {
  return String(eventGuid++);
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @ViewChild('fullcalendar') calendarComponent: FullCalendarComponent;
  @ViewChild('modalShow') modalShow: TemplateRef<any>;
  @ViewChild('editmodalShow') editmodalShow: TemplateRef<any>;

  breadCrumbItems: Array<{}>;
  formData: FormGroup;
  formEditData: FormGroup;
  submitted = false;
  calendarOptions: CalendarOptions;
  editEvent: EventApi;
  newEventDate: any;


  formation:Formation=new Formation();
  idFormation:number;

  TableEmployes: User[]=[];
  TableEmployesForFormation: User[]=[];


  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private formationService: FormationService,
    private cdr: ChangeDetectorRef,private userService: UserService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Skote' }, { label: 'Calendar', active: true }];
    this.initializeForms();
    this.initializeCalendarOptions();
    this.getAllFormation();
  }

  initializeForms(): void {
    this.formData = this.formBuilder.group({
      title: ['', [Validators.required]],
      category: ['bg-info'],
      start: ['', [Validators.required]],
      end: ['']
    });

    this.formEditData = this.formBuilder.group({
      editTitle: ['', [Validators.required]],
      editCategory: ['bg-info'],
      editStart: ['', [Validators.required]],
      editEnd: ['']
    });
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
      eventClick: this.handleEventClick.bind(this),
      dateClick: this.handleDateClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        meridiem: false,
        hour12: true
      }
    };
  }
  getallemployee() {
    this.userService.getAllUsers().subscribe(users => {
      this.TableEmployes = users.filter(user => user.type === 'EMPLOYE');
      console.log('Filtered Employe Users:', this.TableEmployes);
    
      // Now you can work with the list of employe users, e.g., display them, process them, etc.
    });
  }

  getAllFormation(): void {
    this.formationService.getAllFormations().subscribe(
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

        this.cdr.detectChanges();
        this.getallemployee();
      },
      error => {
        console.error('Error fetching formations:', error);
      }
    );
  }
  selectemploye(user: User): void {
    if (!this.TableEmployesForFormation.some((e) => e.id === user.id)) {
      // Check if the competance is already added
      this.TableEmployesForFormation.push(user); // Add employee to the table
      this.TableEmployes = this.TableEmployes.filter((us) => us.id !== user.id);
      console.log(this.TableEmployesForFormation)
    } else {
      alert('employe is already added to the table.');
    }
  }
  removeEmployeForFormation(empID: number , user: User){
    if(!this.TableEmployesForFormation){
      this.TableEmployesForFormation = []
    }

    if(!this.TableEmployes){
      this.TableEmployes = []
    }

    // Remove the comptence from the TableCompetancesForUser
    this.TableEmployesForFormation = this.TableEmployesForFormation.filter((us) => us.id !== empID);

    // Add the comptence back to Employees
     this.TableEmployes.push(user);



  }


  handleDateClick(arg): void {
    this.formData.patchValue({
      start: arg.dateStr,
      end: arg.dateStr
    });
    this.modalService.open(this.modalShow);
  }

  saveEvent(): void {
    this.submitted = true;
    if (this.formData.invalid) {
      return;
    }

    const newEvent: EventInput = {
      id: createEventId(),
      title: this.formData.value.title,
      start:  this.formData.value.start,
      end: this.formData.value.end || this.formData.value.start,
    };
    
   
    this.formation.nom=newEvent.title
    this.formation.dateDebut = this.parseDate(newEvent.start);  // This includes both date and time
    this.formation.dateFin = this.parseDate(newEvent.end);
    this.formation.users=this.TableEmployesForFormation

    console.log(this.formation.users)
    this.formationService.addFormation(this.formation).subscribe(
      (response:Formation) => {
      
            const calendarApi = this.calendarComponent.getApi();
            calendarApi.addEvent(newEvent);
        
            this.modalService.dismissAll();
            this.formData.reset();
            this.submitted = false;
            this.initializeForms();
            this.initializeCalendarOptions();
            this.getAllFormation();
            Swal.fire('Success', 'Event added successfully', 'success');
                // Handle successful response
          
        
        console.log('Formation added successfully:', response);

       
      }),
      (error) => {
        // Handle error
        console.error('Error adding formation:', error);
      }
      ;

    
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.TableEmployesForFormation=[]
    this.editEvent = clickInfo.event;
  
    // Convert event times to datetime-local string format
    this.idFormation=+clickInfo.event.id
    this.formationService.getFormationById(this.idFormation).subscribe((data:Formation)=>{
      console.log(data)
      data.users.forEach((user:User) => {
        this.selectemploye(user)
      });
      
    })
   /*  this.userService.getUsersByFormation(this.idFormation).subscribe((users:User[])=>{
      this.TableEmployesForFormation=users
    }) */
    const formattedStart = this.formatDateToLocalString(new Date(clickInfo.event.startStr));
    const formattedEnd = this.formatDateToLocalString(new Date(clickInfo.event.endStr));
  
    // Initialize form with event data
    this.formEditData = this.formBuilder.group({
      editTitle: [clickInfo.event.title, [Validators.required]],
      editStart: [formattedStart, [Validators.required]],
      editEnd: [formattedEnd || formattedStart] // Default to start time if end time is not present
    });
  
    this.modalService.open(this.editmodalShow);
  }

  editEventSave(): void {
    this.submitted = true;
    if (this.formEditData.invalid) {
      return;
    }

    this.editEvent.setProp('title', this.formEditData.value.editTitle);
    this.editEvent.setStart(this.formEditData.value.editStart);
    this.editEvent.setEnd(this.formEditData.value.editEnd);
    this.formation.nom=this.formEditData.value.editTitle
    this.formation.dateDebut = new Date(this.formEditData.value.editStart);  // This includes both date and time
    this.formation.dateFin = new Date(this.formEditData.value.editEnd);
    this.formationService.updateFormation(this.idFormation,this.formation).subscribe((data:Formation)=>{
      console.log(data)
      this.TableEmployesForFormation.forEach((employe:User) => {
        employe.formation.push(data)
        this.userService.updateUser(employe.id,employe).subscribe((data)=>{
          console.log(data)
          this.modalService.dismissAll();
          this.formEditData.reset();
          this.submitted = false;
          Swal.fire('Success', 'Event updated successfully', 'success');
          this.initializeForms();
          this.initializeCalendarOptions();
          this.getAllFormation();

        })
      })

     
    })
    
  }

  deleteEventData(): void {
    this.editEvent.remove();
    this.formationService.deleteFormation(+this.editEvent.id).subscribe(data=>{
      this.modalService.dismissAll();
      Swal.fire('Deleted!', 'Event has been deleted.', 'success');
      this.initializeForms();
      this.initializeCalendarOptions();
      this.getAllFormation();
    })
   
  }

  handleEvents(events: EventApi[]): void {
    // You can perform actions with the current events if needed
  }

  closeEventModal() {
    this.formData = this.formBuilder.group({
      title: '',
      category: '',
      end: '',
      start: ''
    });
    this.formData.reset();
    this.getallemployee();
    this.TableEmployesForFormation=[];
    this.modalService.dismissAll();
  }
   parseDate(dateInput: DateInput): Date | null {
    if (dateInput instanceof Date) {
      return dateInput;
    } else if (typeof dateInput === 'string') {
      // Attempt to parse string date-time
      const parsedDate = new Date(dateInput);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    } else if (typeof dateInput === 'number') {
      return new Date(dateInput);
    } else if (Array.isArray(dateInput)) {
      // Handle array format if applicable (e.g., [year, month, day, hours, minutes])
      if (dateInput.length === 5) {
        return new Date(dateInput[0], dateInput[1] - 1, dateInput[2], dateInput[3], dateInput[4]);
      }
    }
    return null;
  }

  formatDateToLocalString(date: Date): string {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  
}

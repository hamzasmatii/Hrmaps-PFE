import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartType } from './chartjs.model';
import { ServiceEq } from 'src/app/core/models/ServiceEq';
import { User } from 'src/app/core/models/User';
import { UserService } from 'src/app/core/services/User.service';
import { CompetenceService } from 'src/app/core/services/competence.service';
import { Competence } from 'src/app/core/models/Competence';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobPosition } from 'src/app/core/models/JobPosition';
import { Evaluation } from 'src/app/core/models/Evaluation';
import { EvaluationService } from 'src/app/core/services/Evaluation.service';
import { EvaluationType } from 'src/app/core/models/EvaluationType';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Notification } from 'src/app/core/models/Notification';


@Component({
  selector: 'app-employe-detail',
  templateUrl: './employe-detail.component.html',
  styleUrls: ['./employe-detail.component.scss']
})
export class EmployeDetailComponent implements OnInit {
  user: User;
  idUser:number;
  // Line Chart
  lineAreaChart: any={};
  competanceNames: Competence[] = [];

  selectedServiceName: ServiceEq = new ServiceEq(); // Store the selected service name

  posteUser: JobPosition = new JobPosition();
  idPoste:number=null;
  SelcetedPoste: JobPosition = new JobPosition();

  selectedEvaluation: EvaluationType;
  selectedCompetance: Competence=new Competence();
  selectedCompetanceStat:Competence=new Competence();
  evaluation:Evaluation= new Evaluation();
  evaluationForuser:Evaluation[]=[]
  evaluationForuserStat:Evaluation[]=[]
  typeEvalu=EvaluationType;
  noteCompetence:number;
  noteCompetenceStat:number;
  noteposte:number=0;

  role:string=this.userService.getRole()


  

  constructor(private userService: UserService,private router: Router,private route: ActivatedRoute,
    private competanceservice:CompetenceService, private modalService: NgbModal, private evaluationService: EvaluationService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.idUser = +this.route.snapshot.params['id'];
    this.getUserById(this.idUser);
    this._fetchData();
    
  }

  getUserById(id: number): void {
    this.userService.getUserById(id).subscribe((res:User) => {
      this.user = res;
      if(this.user){
      if(this.user.notePoste !=0){
        this.noteposte=this.user.notePoste;
      }
      this.userService.getServiceEqByUserId(this.user.id).subscribe((serviceEq: ServiceEq) => {
        this.user.serviceEq = serviceEq; // Associate serviceEq with the user
        this.selectedServiceName =this.user.serviceEq;

        console.log(`Service Eq for User ID ${this.user.id}:`, serviceEq);
      });
      this.userService.getJobPositionForUser(this.user.id).subscribe((job : JobPosition)=>{
        if(job){
        this.posteUser=job;
        this.idPoste=job.id;
        this.SelcetedPoste=job;
        this.competanceNames=job.competencesRequises;
      }
        
      })
      
      console.log(this.user)
      console.log(res)
      console.log(this.user.serviceEq?.nom)
    }
    
    }, error => {
      // Handle any errors that occur during the request
      console.error("Error loading employe:", error);
    });
    
  }
 
  
   /**
   * Open modal
   * @param content modal content
   */
   openModal(content: any,comp:Competence,idEval:number) {
    if(idEval){
      
      this.evaluationService.getEvaluationById(idEval).subscribe((data:Evaluation)=>{
        this.selectedEvaluation=data.eval;
        this.evaluation=data;
      })
    }else{
      this.selectedEvaluation=null;
    }
    
    this.selectedCompetance=comp;
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  onSubmit() {
    this.ajouterOrUpdateEvaluation(this.evaluation);

  }

  ajouterOrUpdateEvaluation(evalu:Evaluation){
    if(this.evaluation.id){
      this.evaluation.eval=this.selectedEvaluation
      this.evaluation.user={id:this.idUser};
      this.evaluation.competence=this.selectedCompetance;
      this.evaluationService.updateEvaluation(this.evaluation.id,this.evaluation).subscribe((data:Evaluation)=>{
        console.log(data);
        this.getUserById(this.idUser);
        this.selectCompetence(this.selectedCompetance);
      this.selectedCompetanceStat=this.selectedCompetance;
      this.selectCompetenceStat(this.selectedCompetanceStat);
      this.createNotification('Update', this.evaluation);
      this.refreshNotePoste();
      })

    }else{
      evalu.user={id:this.idUser};
    evalu.competence=this.selectedCompetance;
    evalu.eval=this.selectedEvaluation;
    
    this.evaluationService.addEvaluation(evalu).subscribe((data:Evaluation)=>{
      console.log(data);
      this.getUserById(this.idUser);
      this.selectCompetence(this.selectedCompetance);
      this.selectedCompetanceStat=this.selectedCompetance;
      this.selectCompetenceStat(this.selectedCompetanceStat);
      this.createNotification('Add', evalu);
      this.refreshNotePoste();
      /* this.getevaluationcompetenceUser(this.selectedCompetance)   
      this.getevaluationcompetenceUserCroissant(this.selectedCompetanceStat);    */
    })

    }

    
  }

  selectCompetence(compet: Competence): void {
    this.selectedCompetance = compet; // Update the selected service name
    this.getevaluationcompetenceUser(compet);
    this.evaluationService.calculateAndAssignAverageNote(this.idUser,compet.id).subscribe((data:number)=>{
      this.noteCompetence=parseFloat(data.toFixed(2));
    })  
    console.log('Selected Chef:', this.selectedCompetance); // Optional: Log the selected service name
  }
  selectCompetenceStat(compet: Competence): void {
    this.selectedCompetanceStat = compet; // Update the selected service name
    console.log(compet)
    this.getevaluationcompetenceUserCroissant(compet);
    this.refreshNotePoste();
    this.evaluationService.calculateAndAssignAverageNote(this.idUser,compet.id).subscribe((data:number)=>{
      this.noteCompetenceStat=parseFloat(data.toFixed(2));
    })

   
  
    console.log('Selected Chef:', this.selectedCompetance); // Optional: Log the selected service name
  }

  getevaluationcompetenceUserCroissant(competence:Competence){
    console.log(competence)
    this.evaluationService.getEvaluationsByUserIdAndCompetenceIdwithoutForUser(this.idUser,competence.id).subscribe((data:Evaluation[])=>{
      console.log(data)
      this.evaluationForuserStat = data.sort((a, b) => {
        return new Date(a.dateEvalu).getTime() - new Date(b.dateEvalu).getTime();
        
      });
      this._fetchData()
      this.refreshNotePoste();
    })
    console.log(this.evaluationForuserStat)
   
  }

  getevaluationcompetenceUser(competence:Competence){
    this.evaluationService.getEvaluationsByUserIdAndCompetenceIdwithoutForUser(this.idUser,competence.id).subscribe((data:Evaluation[])=>{
      this.evaluationForuser = data.sort((a, b) => {
        return new Date(b.dateEvalu).getTime() - new Date(a.dateEvalu).getTime();
      });
      
    })
    console.log("histoorique"+this.evaluationForuser)

  }

  deleteEvaluation(id:number){
    this.evaluationService.deleteEvaluation(id).subscribe((data)=>{
      this.getUserById(this.idUser);
      this.selectCompetence(this.selectedCompetance);
      this.selectedCompetanceStat=this.selectedCompetance;
      this.selectCompetenceStat(this.selectedCompetanceStat);
      this.createNotification('Delete', this.evaluation);
      this.refreshNotePoste();
    })
    
  }

  createNotification(action: string, evaluation: Evaluation) {
    this.refreshNotePoste();
    const notification: Notification = {
      message: `${action} : Evaluation ${evaluation.eval} for competence ${evaluation.competence.nom} on ${new Date().toLocaleDateString()}`,
      read: false,
      link: `/dashboard/employe/profile/${this.idUser}`,
      users: [{ id: this.idUser }]
    };
    this.notificationService.createNotification(notification).subscribe(
      (notificationResponse: Notification) => {
        console.log('Notification created successfully:', notificationResponse);
      },
      (notificationError) => {
        console.error('Error creating notification:', notificationError);
      }
    );
  }

  refreshNotePoste() {
    this.userService.getUserById(this.idUser).subscribe((res: User) => {
      if(this.user.notePoste !=0){
        this.noteposte=this.user.notePoste;
      }
    });
  }

  private _fetchData() {
    const dateEvaluation: string[] = [];
    const noteEvaluation: number[] = [];
  
    this.evaluationForuserStat.forEach((evaluation: Evaluation) => {
      const formattedDate = new Date(evaluation.dateEvalu).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      dateEvaluation.push(formattedDate);
      noteEvaluation.push(evaluation.note);
    });
    console.log(this.evaluationForuserStat)
    console.log(dateEvaluation)
    console.log(noteEvaluation)

  if(noteEvaluation!==null){
    this.lineAreaChart = {
      labels: dateEvaluation,
      datasets: [
        {
          label: 'Evaluation Scores', // Updated label
          fill: true,
          lineTension: 0.5,
          backgroundColor: 'rgba(85, 110, 230, 0.2)',
          borderColor: '#780606',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#780606',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#780606',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: noteEvaluation,
        },
      ],
      options: {
        defaultFontColor: '#8791af',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              gridLines: {
                color: 'rgba(166, 176, 207, 0.1)',
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                max: 6, // Assuming the note scale is from 1 to 5
                min: 0,
                stepSize: 0.5,
              },
              gridLines: {
                color: 'rgba(166, 176, 207, 0.1)',
              },
            },
          ],
        },
      },
    };
  }
  }
  
  


}

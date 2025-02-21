import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartType } from './apex.model';
import { JobPosition } from 'src/app/core/models/JobPosition';
import { User } from 'src/app/core/models/User';
import { CompetenceService } from 'src/app/core/services/competence.service';
import { EvaluationService } from 'src/app/core/services/Evaluation.service';
import { JobPositionService } from 'src/app/core/services/JobPosition.service';
import { UserService } from 'src/app/core/services/User.service';
import { dashedLineChart} from './data';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Competence } from 'src/app/core/models/Competence';
import { EvaluationType } from 'src/app/core/models/EvaluationType';
import { Evaluation } from 'src/app/core/models/Evaluation';

@Component({
  selector: 'app-poste-detail',
  templateUrl: './poste-detail.component.html',
  styleUrls: ['./poste-detail.component.scss']
})
export class PosteDetailComponent implements OnInit {
  dashedLineChart: ChartType;
  lineBarChart: any={};
  lineBarChartStat: any={};

  idPoste:number;
  poste:JobPosition=new JobPosition();
  TableEmployees: User[] = [];
  Users: User[] = [];

  
  nomUser: string[] = [];
  notePoste: number[] = [];

  nomUserComp: string[] = [];
  noteComp: number[] = [];


  TableCompetancesForPoste: Competence[]=[];
  SelctedCompStat:Competence=new Competence();

  competanceNames: { [userId: number]: Competence[] } = {};

  constructor(private http: HttpClient,private userService: UserService,private router: Router,private route: ActivatedRoute,
    private competanceservice:CompetenceService, private modalService: NgbModal, private evaluationService: EvaluationService,private posteService:JobPositionService) { }

  ngOnInit(): void {
    this.idPoste = +this.route.snapshot.params['id'];
    this.getposte(this.idPoste);
    this.GETUSER(this.idPoste)
    this._fetchData();
    this._fetchDataBar();
    this._fetchDataBarStat();
   
  }

  getposte(id:number){
    this.posteService.getJobPositionById(id).subscribe((job:JobPosition)=>{
      this.poste=job;
      this.TableCompetancesForPoste= job.competencesRequises
      })
      
  }

  GETUSER(id:number){
    this.posteService.getUsersForJobPosition(id)
      .subscribe(data => {
        this.TableEmployees=data
        data.sort((a: User, b: User) => (a.notePoste || 0) - (b.notePoste || 0));

        data.forEach((user:User) => {
          this.notePoste.push(user?.notePoste || 0);
          this.nomUser.push(user?.nom || 'N/A');
          this.userService.getJobPositionForUser(user.id).subscribe((job : JobPosition)=>{
            if(job){
            this.competanceNames[user.id]=job.competencesRequises && job.competencesRequises ? job.competencesRequises : null;
          }
            
          })
          
        });
        
        
      }, error => {
        console.error('Error:', error);
      }); 
     }

  employeDetails(id: number){
    this.router.navigate(['/employe/profile/', id]);
  }

  private _fetchData() {
    this.dashedLineChart = dashedLineChart;
   
  }

  private _fetchDataBar() {
      
    
  
    

    if(this.notePoste!==null){
      this.lineBarChart = { 
        labels: this.nomUser,
    datasets: [
        {
            label: 'Poste Analytics',
            backgroundColor: 'rgba(52, 195, 143, 0.8)',
            borderColor: 'rgba(52, 195, 143, 0.8)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(52, 195, 143, 0.9)',
            hoverBorderColor: 'rgba(52, 195, 143, 0.9)',
            data: this.notePoste,
            barPercentage: 0.4
  
        },
    ],
    options: {
        maintainAspectRatio: false,
        scales: {
            xAxes: [
                {
                    gridLines: {
                        color: 'rgba(166, 176, 207, 0.1)'
                    },
                }
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
        }
    }};
    }
    }

    selectcompetance(compl: Competence): void {
     
      this.SelctedCompStat=compl
       console.log(this.SelctedCompStat)  ;
       this.TableEmployees.sort((a: User, b: User) => (a.notePoste || 0) - (b.notePoste || 0));
       this.nomUserComp=[];
            this.noteComp=[];
       this.TableEmployees.forEach((user:User) => {
        this.evaluationService.findEvaluationsUserbyType(user.id,compl.id,EvaluationType.FORUSER).subscribe((data:Evaluation[])=>{
          data.forEach((data:Evaluation) => {
            
            this.nomUserComp.push(user.nom);
            this.noteComp.push(data.note);
            
          });
        })
        
       });
       this._fetchDataBarStat();
       
      
    }

  private _fetchDataBarStat() {
    
    

  if(this.noteComp!==null){
    this.lineBarChartStat = { 
      labels: this.nomUserComp,
  datasets: [
      {
          label: 'Poste Analytics',
          backgroundColor: 'rgba(52, 195, 143, 0.8)',
          borderColor: 'rgba(52, 195, 143, 0.8)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(52, 195, 143, 0.9)',
          hoverBorderColor: 'rgba(52, 195, 143, 0.9)',
          data: this.noteComp,
          barPercentage: 0.4

      },
  ],
  options: {
      maintainAspectRatio: false,
      scales: {
          xAxes: [
              {
                  gridLines: {
                      color: 'rgba(166, 176, 207, 0.1)'
                  },
              }
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
      }
  }};
  }
  }

}

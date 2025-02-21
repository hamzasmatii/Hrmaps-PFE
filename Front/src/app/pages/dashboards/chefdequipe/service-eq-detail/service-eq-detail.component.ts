import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceEq } from 'src/app/core/models/ServiceEq';
import { User } from 'src/app/core/models/User';
import { ServiceEqService } from 'src/app/core/services/ServiceEq.service';
import { UserService } from 'src/app/core/services/User.service';

import { ChartType } from './apex.model';
import { JobPosition } from 'src/app/core/models/JobPosition';
import { JobPositionService } from 'src/app/core/services/JobPosition.service';
import { Competence } from 'src/app/core/models/Competence';

@Component({
  selector: 'app-service-eq-detail',
  templateUrl: './service-eq-detail.component.html',
  styleUrls: ['./service-eq-detail.component.scss']
})
export class ServiceEqDetailComponent implements OnInit {
  id:number;
  serviceEq:ServiceEq=new ServiceEq();
  TableEmployees: User[] = [];
  lineBarChart: any={};

  jobPositions: { [userId: number]: string } = {};
  competenceposte: { [userId: number]: string[]} = {};

   nomUser: string[] = [];
   notePoste: number[] = [];


  //dashline 



  constructor(private userservice: UserService,
    private route: ActivatedRoute,
    private router: Router,private serviceEqservice: ServiceEqService,private posteService:JobPositionService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.LoadService(this.id)
    this._fetchDataBar();
  }

  LoadService(id:number){
    this.serviceEqservice.getServiceEqById(id).subscribe((res:ServiceEq)=>{
      this.serviceEq=res;
      console.log(this.serviceEq)
      if(this.serviceEq.employes.length > 0){
        this.getUsersByServiceEqId(res.id)

      }else{
        this.TableEmployees=[]
      }
    })
  }

  getUsersByServiceEqId(eqId: number): void {
    this.userservice.findUsersByServiceEqId(eqId).subscribe({
      next: (data: User[]) => {
        this.TableEmployees = data;
        data.sort((a: User, b: User) => (a.notePoste || 0) - (b.notePoste || 0));
        console.log('Users:', this.TableEmployees);
        data.forEach((user:User)=>{
          this.getPosteNom(user.id)
          this.notePoste.push(user?.notePoste || 0);
          this.nomUser.push(user?.nom || 'N/A');
        })
  
        
        
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  employeDetails(id: number){
    this.router.navigate(['/employe/profile/', id]);
  }

  getPosteNom(userId: number): void {
    this.userservice.getJobPositionForUser(userId).subscribe(
      (job: JobPosition) => {
        console.log('Fetched job:', job); // Debugging log
        
        // Store job position name
        this.jobPositions[userId] = job?.nom || 'N/A';
  
        // Ensure the competenceposte array is initialized
        if (!this.competenceposte[userId]) {
          this.competenceposte[userId] = [];
        }
  
        // Store required competencies
        job?.competencesRequises?.forEach((comp: Competence) => {
          this.competenceposte[userId].push(comp?.nom || 'N/A');
        });
      },
      (error) => {
        console.error('Error fetching job position:', error); // Debugging log
        
        // Handle error case
        this.jobPositions[userId] = 'N/A';
        
        // Ensure the competenceposte array is initialized in case of an error
        if (!this.competenceposte[userId]) {
          this.competenceposte[userId] = [];
        }
        this.competenceposte[userId].push('N/A');
      }
    );
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


}

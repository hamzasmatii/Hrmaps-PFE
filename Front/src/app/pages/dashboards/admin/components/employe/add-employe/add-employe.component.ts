import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Competence } from 'src/app/core/models/Competence';
import { Evaluation } from 'src/app/core/models/Evaluation';
import { EvaluationType } from 'src/app/core/models/EvaluationType';
import { JobPosition } from 'src/app/core/models/JobPosition';
import { ServiceEq } from 'src/app/core/models/ServiceEq';
import { User } from 'src/app/core/models/User';
import { UserType } from 'src/app/core/models/UserType';
import { CompetenceService } from 'src/app/core/services/competence.service';
import { EvaluationService } from 'src/app/core/services/Evaluation.service';
import { JobPositionService } from 'src/app/core/services/JobPosition.service';
import { ServiceEqService } from 'src/app/core/services/ServiceEq.service';
import { UserService } from 'src/app/core/services/User.service';

@Component({
  selector: 'app-add-employe',
  templateUrl: './add-employe.component.html',
  styleUrls: ['./add-employe.component.scss']
})
export class AddEmployeComponent implements OnInit {

  typeValidationForm: FormGroup; // type validation form
  typesubmit: boolean;
  competanceData: FormGroup;

  user: User = new User();

 
  equipe:ServiceEq[]=[];
  serviceChefDequipe:ServiceEq=new ServiceEq();
  deleteChef:boolean=false;

  posteUser: JobPosition = new JobPosition();
  SelcetedPoste: JobPosition = new JobPosition();
  idPoste:number=null;
  Allposte: JobPosition[] = [];

  TableCompetancesForUser: Competence[]=[];

  TableCompetancesForPoste: Competence[]=[];
  evaluation: Evaluation = new Evaluation();
  evaluationType = EvaluationType;

  



  selectedServiceName: ServiceEq = new ServiceEq(); // Store the selected service name


  isEditMode: boolean = false;
  id:number;
  UserType = UserType;
  userTypes: UserType[] = [ UserType.CHEF_EQUIPE, UserType.EMPLOYE];





constructor(public formBuilder: FormBuilder, private modalService: NgbModal,private fb: FormBuilder,private userService: UserService,private evalutionService: EvaluationService,
  private route: ActivatedRoute,
  private router: Router,private jobpositionService:JobPositionService,private serviceEqservice: ServiceEqService) {
  this.competanceData = this.fb.group({
    competanceValue: this.fb.array([]),
  });
 }

  ngOnInit(): void {
    /**
     * Type validation form
     */
   this.typeValidationForm = this.formBuilder.group({
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    mdp: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
    url: ['', [Validators.required, Validators.pattern('https?://.+')]],
    digits: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    number: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    alphanum: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
    textarea: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmpwd: ['', Validators.required]
  });

  this.id = this.route.snapshot.params['id'];
  if (this.id) {
    this.isEditMode = true;
    this.loadUser(this.id);
    
  }
  this.getAllEquipes();
  this.getAllPostes();
  }

  loadUser(id: number) {
    this.userService.getUserById(id).subscribe((res:User) => {
      this.user = res;
      if(this.user.type===UserType.CHEF_EQUIPE){
      this.serviceEqservice.getServiceEqByChefId(this.user.id).subscribe((serviceEq: ServiceEq) => {
        this.user.chefEquipeService = serviceEq; // Associate serviceEq with the user
        this.selectedServiceName =serviceEq;
        this.user.chefEquipeService=serviceEq

        console.log(`Service Eq for User ID ${this.user.id}:`, serviceEq);
      });
      
      console.log(this.user)
      console.log(res)
    }else if(this.user.type===UserType.EMPLOYE){
      
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
        this.TableCompetancesForUser=job.competencesRequises
        this.jobpositionService.getJobPositionById(job.id).subscribe((job:JobPosition)=>{
          this.TableCompetancesForPoste= job.competencesRequises
          console.log(this.TableCompetancesForPoste)
        console.log(this.TableCompetancesForUser)

        this.TableCompetancesForPoste = this.TableCompetancesForPoste.filter((posteCompetence:Competence) => {
          return !this.TableCompetancesForUser.some((userCompetence:Competence) => userCompetence.id == posteCompetence.id);
        });
        
        })

        
      }else{
        this.posteUser=null;
        this.idPoste=null;
        this.SelcetedPoste=null;
        this.TableCompetancesForUser=[];
          this.TableCompetancesForPoste= []
          

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

  getAllEquipes(): void {
    this.serviceEqservice.getAllServiceEqs().subscribe(
      (res: ServiceEq[]) => {
        this.equipe = res;
        console.log('Equipes:', res);
      },
      error => {
        console.error('Error fetching equipes:', error);
      }
    );
  }

  typeSubmit() {
    this.addOrupdateEmploye();
    
  }
  
 
  addOrupdateEmploye() {
    if(this.user.type===UserType.CHEF_EQUIPE){
        if(this.id){//update user
          if(this.selectedServiceName?.id){
            if(this.deleteChef){
              this.selectedServiceName.chefEquipe = null; // Update the selected service name
      
            }else{
              this.selectedServiceName.chefEquipe= {id:this.user.id}
      
            }
              
                
            this.UpadeEquipe(this.selectedServiceName.id,this.selectedServiceName)
          }
          this.userService.updateUser(this.id, this.user).subscribe((data) => {
            console.log(data)
            this.router.navigate(['/dashboard/admin/employe']);
          }, error => console.log(error));
          

        }else{//adduser
        if(this.selectedServiceName.id){
          this.user.chefEquipeService = this.selectedServiceName;
          
        }
        
        
        this.userService.addUser(this.user).subscribe((res:User) => {
          
          
          if(this.selectedServiceName?.id){
            this.selectedServiceName.chefEquipe= {id:res.id}
            this.UpadeEquipe(this.selectedServiceName.id,this.selectedServiceName)

        }
      
        
          this.router.navigate(['/dashboard/admin/employe']);
        });
      }
    }else if(this.user.type===UserType.EMPLOYE){
      if (this.id){//update employe
        if(this.selectedServiceName?.id){
          this.user.serviceEq = {id:this.selectedServiceName.id};
        }
        console.log(this.user)
        
        this.userService.updateUser(this.id, this.user).subscribe((data) => {
          this.user=data
         this.router.navigate(['/dashboard/admin/employe']);
        }, error => console.log(error));
        this.addORupdatePosteforUser(this.user);
        
        

      }else{//add employe
        if(this.selectedServiceName.id){
          this.user.serviceEq = this.selectedServiceName;
        }
        
        
        this.userService.addUser(this.user).subscribe((data) => {

          this.addORupdatePosteforUser(data);
          this.router.navigate(['/dashboard/admin/employe']);
        });

      }


    }
  }

  selectService(service: ServiceEq): void {
    this.deleteChef=false;
    if(this.user.type===UserType.CHEF_EQUIPE){
    this.user.chefEquipeService=service;
    }

    this.selectedServiceName = service; // Update the selected service name
    console.log('Selected Service:', this.selectedServiceName); // Optional: Log the selected service name
  }
  selectTypeUser(item: UserType): void {
    
    this.user.type=item;

   
    console.log('Selected Service:', this.user.type); // Optional: Log the selected service name
  }
  DontselectService(): void {
    if(this.user.type===UserType.CHEF_EQUIPE){
    this.deleteChef=true;
    this.user.chefEquipeService=null
    this.selectedServiceName.chefEquipe = null; // Update the selected service name
    }else if(this.user.type===UserType.EMPLOYE){
    this.selectedServiceName=null
    this.user.serviceEq = null; // Update the selected service name
    }
    console.log('Selected Service:', this.selectedServiceName); // Optional: Log the selected service name
  }

  get type() {
    return this.typeValidationForm.controls;
  }
  cancelBut(){
    this.router.navigate(['/dashboard/admin/employe']);
  }

  UpadeEquipe(id:number,serviceeq : ServiceEq){

    this.serviceEqservice.updateServiceEq(id,serviceeq).subscribe((res:ServiceEq)=>{
      console.log("updaaaateee",res);
    })
  }

  getAllPostes() {
      
    this.jobpositionService.getAllJobPositions().subscribe((res) => {
      this.Allposte = res;
      console.log(res)
      
    });
  }

    /**
   * Open modal
   * @param content modal content
   */
    openModal(content: any,idPoste:number) {
      
      if(idPoste===null){
        
      }else{

        
      }
      this.modalService.open(content, {
       
        size: 'lg', // Set modal size to large
        centered: true, // Center the modal on the screen
      });
  
    }

    SubmitService(){
     
      console.log(this.TableCompetancesForUser);
      
    }

    addORupdatePosteforUser(user:User){
      if(this.idPoste){
         this.TableCompetancesForPoste.forEach((comp:Competence)=>{
          this.evalutionService.findallEvaluationsUserandcompet(user.id,comp.id).subscribe((evalu:Evaluation[])=>{
            evalu.forEach((evalutio:Evaluation)=>{
              this.evalutionService.deleteEvaluation(evalutio.id).subscribe((data)=>{
                console.log(data)
              })
            })
          })
        }) 
        /*this.evalutionService.deleteEvaluation(36).subscribe((data)=>{
          console.log(data)
        })*/
       this.TableCompetancesForUser.forEach((comp:Competence)=>{
          this.evaluation.eval = this.evaluationType.FORUSER
          this.evaluation.user = user
          this.evaluation.competence = comp
          this.evalutionService.addEvaluation(this.evaluation).subscribe((data : Evaluation)=>{
            console.log(data);
          })
        })
        
      }else{
         this.TableCompetancesForUser.forEach((comp:Competence)=>{
          this.evaluation.eval = this.evaluationType.FORUSER
          this.evaluation.user = user
          this.evaluation.competence = comp
          this.evalutionService.addEvaluation(this.evaluation).subscribe((data : Evaluation)=>{
            console.log(data);
          })
        }) 
      }

    }

    DontSelcetedPoste(){
      this.SelcetedPoste=null
    }

    selectposte(poste: JobPosition): void {
      this.SelcetedPoste = poste; // Update the selected service name
      this.TableCompetancesForPoste=poste.competencesRequises
    
      console.log('Selected Chef:', this.SelcetedPoste); // Optional: Log the selected service name
    }

    selectcompetance(compl: Competence): void {
      if (!this.TableCompetancesForUser.some((e) => e.id === compl.id)) {
        // Check if the competance is already added
        this.TableCompetancesForUser.push(compl); // Add employee to the table
        this.TableCompetancesForPoste = this.TableCompetancesForPoste.filter((comp) => comp.id !== compl.id);
        console.log(this.TableCompetancesForUser)
      } else {
        alert('competance is already added to the table.');
      }
    }


    removeCompetenceForUser(compId: number , competence: Competence){
      if(!this.TableCompetancesForUser){
        this.TableCompetancesForUser = []
      }

      if(!this.TableCompetancesForPoste){
        this.TableCompetancesForPoste = []
      }

      // Remove the comptence from the TableCompetancesForUser
      this.TableCompetancesForUser = this.TableCompetancesForUser.filter((comp) => comp.id !== compId);
  
      // Add the comptence back to Employees
       this.TableCompetancesForPoste.push(competence);



    }

    deleteEvaluationsByUser(){
      this.evalutionService.deleteEvaluationsByUser(this.id).subscribe(()=>{
        this.loadUser(this.id);
        
      })
    }
  

}



import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs';

import { Table } from './advanced.model';


import { AdvancedService } from './advanced.service';
import { AdvancedSortableDirective, SortEvent } from './advanced-sortable.directive';
import { Router } from '@angular/router';
import { ServiceEq } from 'src/app/core/models/ServiceEq';
import { User } from 'src/app/core/models/User';
import { ServiceEqService } from 'src/app/core/services/ServiceEq.service';
import { UserService } from 'src/app/core/services/User.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { nullSafeIsEquivalent, THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { JobPosition } from 'src/app/core/models/JobPosition';



@Component({
  selector: 'app-service-eq',
  templateUrl: './service-eq.component.html',
  styleUrls: ['./service-eq.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class ServiceEqComponent implements OnInit {
    // bread crum data
    breadCrumbItems: Array<{}>;
    // Table data
    tableData: ServiceEq[] = [];
    tableDataEmploye: User[] = [];
    sortField: string = '';
  sortOrder: boolean = true; // true for ascending, false for descending

    public selected: any;
    hideme: boolean[] = [];
    tables$: Observable<Table[]>;
    tablesemp$: Observable<Table[]>;
    total$: Observable<number>;
    editableTable: any;

    idServiceEq:number;
    employeData: FormGroup;
    serviceEq:ServiceEq=new ServiceEq();

    Users: User[] = [];
    Employees: User[] = [];
    selectedChef: User=new User();
    TableEmployees: User[] = [];

    jobPositions: { [userId: number]: string } = {};



  
    @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;
    public isCollapsed = true;
  
    constructor(public service: AdvancedService,private serviceEqservice: ServiceEqService ,private userservice: UserService,
      private router: Router, private modalService: NgbModal,private fb: FormBuilder) {
      this.tables$ = this.service.tables$;
      this.total$ = service.total$;
    }

   
  
    ngOnInit() {
      this.breadCrumbItems = [{ label: 'Tables' }, { label: 'Advanced Table', active: true }];
      this.reloadData();
    }
  
    changeValue(i) {
      this.hideme[i] = !this.hideme[i];
    }
  
  
    /**
     * fetches the table value
     */
    getAllEquipes() {
      
      this.serviceEqservice.getAllServiceEqs().subscribe((res:ServiceEq[]) => {
        this.tableData = res;
        this.tableData.forEach((res: ServiceEq) => {
          res.employes.forEach((user:User)=>{
            this.getPosteNom(user.id)
          })
          
          
        });
  
        console.log(res)
        this.service.setSearchData(this.tableData); // Call a method to update the search data in the service
        this._fetchData();
      });
    }

     /**
   * fetches the table value
   */
  _fetchData() {
    //this.tableData = tableData;
    //this.editableTable = editableTable;
    for (let i = 0; i <= this.tableData.length; i++) {
      this.hideme.push(true);
    }
  }

    
  
    /**
     * Sort table data
     * @param param0 sort the column
     *
     */
    onSort({ column, direction }: SortEvent) {
      // resetting other headers
      this.headers.forEach(header => {
        if (header.sortable !== column) {
          header.direction = '';
        }
      });
      this.service.sortColumn = column;
      this.service.sortDirection = direction;
    }

    onSortemp(field: string) {
      this.sortField = field;
      this.sortOrder = !this.sortOrder; // Inverse l'ordre de tri
    
      // Nous n'avons pas besoin d'appeler sortedEmployees ici car il est appelé dans le modèle HTML
      // via le *ngFor sur les employés triés
    }
    
    sortedEmployees(employees: User[]): User[] {
      
      if (!employees) return [];
    
      return employees.sort((a, b) => {
        let valueA: any = a[this.sortField] !== undefined && a[this.sortField] !== null ? a[this.sortField] : '';
        let valueB: any = b[this.sortField] !== undefined && b[this.sortField] !== null ? b[this.sortField] : '';
    
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return this.sortOrder ? valueA - valueB : valueB - valueA;
        } else {
          valueA = valueA.toString().toLowerCase();
          valueB = valueB.toString().toLowerCase();
          if (valueA < valueB) return this.sortOrder ? -1 : 1;
          if (valueA > valueB) return this.sortOrder ? 1 : -1;
          return 0;
        }
      }).filter(emp => emp.type !== 'CHEF_EQUIPE'); // Exclure le chef d'équipe de la liste triée
    }

    employeDetails(id: number){
      this.router.navigate(['/employe/profile/', id]);
    }
   /**
   * Open modal
   * @param content modal content
   */
   openModal(content: any,id:number) {
    console.log(id)
    console.log(this.idServiceEq)
    if(id){
      console.log("uppp")
      console.log(id)
      this.LoadService(id);
      console.log(this.serviceEq)


    }else{
      console.log("addd")
      this.idServiceEq=null
      this.serviceEq = new ServiceEq()
      this.getUsersWithoutService();
      this.TableEmployees=[];
      this.selectedChef=null;
    }
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  updateServiceEq(idServiceEq:number,serviceEq:ServiceEq){
    serviceEq.chefEquipe=this.selectedChef
    this.serviceEqservice.updateServiceEq(idServiceEq,serviceEq).subscribe((res:ServiceEq) =>{
      serviceEq=res;
      
        this.updateEmploye(res.id)
      
      /*this.getAllEquipes();
      this.getAllChefdequipees();
      this.getUsersWithoutService();*/
    });
  }
  addService(serviceEq:ServiceEq){
    if(this.selectedChef?.id){
      //console.log(this.selectedChef)
    serviceEq.chefEquipe=this.selectedChef
    }
   
    this.serviceEqservice.addServiceEq(serviceEq).subscribe((res:ServiceEq)=>{
      if(this.TableEmployees?.length > 0){
        this.updateEmploye(res.id)
      }else{
        this.reloadData();
        //window.location.reload();
      }
      
      console.log(res);
    })
   
  }
  LoadService(id:number){
    this.serviceEqservice.getServiceEqById(id).subscribe((res:ServiceEq)=>{
      this.serviceEq=res;
      this.selectedChef =this.serviceEq.chefEquipe
      console.log(this.serviceEq)
      this.idServiceEq=id;
      if(this.serviceEq.employes.length > 0){
        this.getUsersByServiceEqId(res.id)

      }else{
        this.TableEmployees=[]
      }
    })
  }

  SuprimerEq(id:number){
    this.serviceEqservice.deleteServiceEq(id).subscribe(res=>{
      console.log(res)
      this.reloadData();
    })

  }

  SubmitService() {
   console.log(this.serviceEq)
    if(this.idServiceEq!==null){
      console.log("udpppdde")
      
      
      this.updateServiceEq(this.idServiceEq,this.serviceEq);
      this.modalService.dismissAll();
      this.reloadData();
      
      
     
    }
    else{
      console.log("aaaaaaaddddddddd")
     
      this.addService(this.serviceEq);
      this.modalService.dismissAll();
      this.reloadData();
      
      

      
      
    }
    this.idServiceEq=null
    
    
    
}


getAllChefdequipees() {
  this.userservice.getChefsWithoutService().subscribe((res: User[]) => {
    console.log(res);
    this.Users = res;
    
   // this.filterChefdequipees(); // Filtrer les utilisateurs de type CHEF_EQUIPE
  });
}



selectChef(chef: User): void {
  this.selectedChef = chef; // Update the selected service name

  console.log('Selected Chef:', this.selectedChef); // Optional: Log the selected service name
}

DontselectChef(): void {
  this.selectedChef =null
  console.log('Selected Chef:', this.selectedChef); // Optional: Log the selected service name
}

getUsersWithoutService(){
  this.userservice.getUsersWithoutService().subscribe(res=>{
    console.log(res)
    this.Employees = res
  })
}

selectEmpl(empl: User): void {
  if (!this.TableEmployees.some((e) => e.id === empl.id)) {
    // Check if the employee is already added
    this.TableEmployees.push(empl); // Add employee to the table
    this.Employees = this.Employees.filter((emp) => emp.id !== empl.id);
    console.log(this.TableEmployees)
  } else {
    alert('Employee is already added to the table.');
  }
}

updateEmploye(idService:number) {
  console.log(this.TableEmployees)
  if(this.TableEmployees?.length > 0){
  this.TableEmployees.forEach((empl:User)=>{
    empl.serviceEq = {id:idService}
    console.log(idService)
    console.log(empl)
    this.userservice.updateUser(empl.id, empl).subscribe((data) => {
      console.log(data)
      this.reloadData();
    }, error => console.log(error));

  })
}
if(this.Employees?.length > 0){
  this.Employees.forEach((empl:User)=>{
    empl.serviceEq = null
    console.log(idService)
    console.log(empl)
    this.userservice.updateUser(empl.id, empl).subscribe((data) => {
      console.log(data)
    }, error => console.log(error));

  })
}
this.reloadData();

}

removeEmployee(employeeId: number, employee: User): void {
  // Ensure TableEmployees and Employees arrays are initialized
  if (!this.TableEmployees) {
    this.TableEmployees = [];
  }

  if (!this.Employees) {
    this.Employees = [];
  }
  


  // Remove the employee from the TableEmployees
  this.TableEmployees = this.TableEmployees.filter((emp) => emp.id !== employeeId);
  
  // Add the employee back to Employees
  this.Employees.push(employee);

  console.log('Updated TableEmployees:', this.TableEmployees);
  console.log('Updated Employees:', this.Employees);
}
getUsersByServiceEqId(eqId: number): void {
  this.userservice.findUsersByServiceEqId(eqId).subscribe({
    next: (data: User[]) => {
      this.TableEmployees = data;
      console.log('Users:', this.TableEmployees);

      // Ensure Employees is not null
      if (this.Employees) {
        this.TableEmployees.forEach((res: User) => {
          this.Employees = this.Employees.filter((emp) => emp.id !== res.id);
        });
      }
    },
    error: (err) => {
      console.error('Error fetching users:', err);
    }
  });
}

chefdequipeDetails(id: number){
  this.router.navigate(['/chefdequipe/profile/', id]);
}

serviceEqDetails(id: number){
  this.router.navigate(['/chefdequipe/serviceEq/', id]);
}

getPosteNom(userId: number): void {
  this.userservice.getJobPositionForUser(userId).subscribe(
    (job: JobPosition) => {
      console.log('Fetched job:', job); // Debugging log
      this.jobPositions[userId] = job && job.nom ? job.nom : 'N/A';
    },
    (error) => {
      console.error('Error fetching job position:', error); // Debugging log
      this.jobPositions[userId] = 'N/A';
    }
  );
}

reloadData(){
    this.getAllEquipes();
    this.getAllChefdequipees();
    this.getUsersWithoutService();
  
}

    
    
  
}

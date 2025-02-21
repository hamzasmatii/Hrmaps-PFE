import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AdvancedService } from './advanced.service';
import { AdvancedSortableDirective, SortEvent } from './advanced-sortable.directive';
import { Table } from './advanced.model';
import { Observable } from 'rxjs';
import { Competence } from 'src/app/core/models/Competence';
import { JobPositionService } from 'src/app/core/services/JobPosition.service';
import { JobPosition } from 'src/app/core/models/JobPosition';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompetenceService } from 'src/app/core/services/competence.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-poste',
  templateUrl: './poste.component.html',
  styleUrls: ['./poste.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class PosteComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  tables$: Observable<Table[]>;
  total$: Observable<number>;
  hideme: boolean[] = [];
  sortField: string = '';
  sortOrder: boolean = true; 

  tableData: JobPosition[] = [];

  competanceData: FormGroup;

  poste: JobPosition = new JobPosition();
  idPoste:number;
  competanceNames: Competence[] = [];




  @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;
  public isCollapsed = true;

  constructor(public service: AdvancedService,private router: Router, private modalService: NgbModal,private competanceservice:CompetenceService,private fb: FormBuilder,private jobpositionService:JobPositionService) {
    this.tables$ = this.service.tables$;
      this.total$ = service.total$;
      this.competanceData = this.fb.group({
        competanceValue: this.fb.array([]),
      });
   }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Tables' }, { label: 'Advanced Table', active: true }];
    this.getAllPostes();
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
  changeValue(i) {
    this.hideme[i] = !this.hideme[i];
  }
  onSortemp(field: string) {
    this.sortField = field;
    this.sortOrder = !this.sortOrder; // Inverse l'ordre de tri
  
    
  }
  sortedCompetances(competances: Competence[]): Competence[] {
      
    if (!competances) return [];
  
    return competances.sort((a, b) => {
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
    }) // Exclure le chef d'équipe de la liste triée
  }


  getAllPostes() {
      
    this.jobpositionService.getAllJobPositions().subscribe((res) => {
      this.tableData = res;
      console.log(res)
      this.service.setSearchData(this.tableData); // Call a method to update the search data in the service
      this._fetchData();
    });
  }
  _fetchData() {
    //this.tableData = tableData;
    //this.editableTable = editableTable;
    for (let i = 0; i <= this.tableData.length; i++) {
      this.hideme.push(true);
    }
  }

 

  getCompetanceNames(competanceNames:Competence[]) {
    const competances = this.competancedata().controls;
    competances.forEach((competance: FormGroup) => {
      const nom = competance.get('competanceNom')?.value;
      const id = competance.get('id')?.value || null; // Get ID or default to null
      competanceNames.push({ id, nom });
      console.log("uuuuuuuuuu",competanceNames);
    });
  }

     /**
   * Open modal
   * @param content modal content
   */
     openModal(content: any,idPoste:number) {
      
      if(idPoste===null){
        this.resetForm();
        this.idPoste=null
      }else{
        this.idPoste=idPoste
        this.loadPoste(this.idPoste);
        this.loadCompetanceByPoste(this.idPoste);
      }
      this.modalService.open(content, {
       
        size: 'lg', // Set modal size to large
        centered: true, // Center the modal on the screen
      });
  
    }
  
    competancedata(): FormArray {
      return this.competanceData.get('competanceValue') as FormArray;
    }
    addCompetance() {
    
      this.competancedata().push(this.competance());
     
    
  }
  competance(): FormGroup {
    return this.fb.group({
      id: null,
      competanceNom: ''
      
    });
  }
  /**
   * Delete competance field from list
   * @param i specified index
   */
  deleteCompetance(i: number,idcomp:number) {
    if(idcomp){
      console.log(idcomp)
    this.competanceservice.deleteCompetence(idcomp).subscribe( (data) => {
      console.log(data);
      this.poste.competencesRequises = this.poste.competencesRequises.filter(competence => competence.id !== idcomp);
      this.competancedata().removeAt(i);
      this.getCompetanceNames(this.competanceNames);
     

     
     
    })
  }else{
    this.competancedata().removeAt(i);
    //this.getCompetanceNames(this.competanceNames);
    this.competanceNames.forEach(competance=>{
      console.log("deleteee  :"+competance.nom)
    })
    //this.loadCompetanceByPoste();
      
  }
}

SubmitPoste() {
   
  
    this.addORupdatePosteAndCompetance(this.idPoste,this.competanceNames);
    
   
    
}

loadPoste(id: number) {
  this.jobpositionService.getJobPositionById(id).subscribe((res:JobPosition) => {
    console.log(res)
    this.poste=res;
  });
}

loadCompetanceByPoste(idPoste:number) {
  this.competanceNames=[]
  this.competanceservice.getCompetencesByJobPositionId(idPoste).subscribe((res:Competence[]) => {
    console.log(res)
    this.competanceNames=res;
    this.loadCompetanceDataToform();
   
  });
}

loadCompetanceDataToform() {
  // Clear the existing controls
  this.competancedata().clear();

  // Add a new FormGroup for each name in competanceNames
  this.competanceNames.forEach(competance => {
    const group = this.fb.group({
      id: competance.id || null,
      competanceNom: competance.nom || ''
    });
    this.competancedata().push(group);
  });
}




addORupdatePosteAndCompetance(idPoste:number,competanceNames:Competence[]) {
 
  if(idPoste===null){
    this.getCompetanceNames(this.competanceNames);
    console.log("Competance Names:", this.competanceNames);
  this.jobpositionService.addJobPosition(this.poste).subscribe((res: JobPosition) => {
    console.log("Job Position ID:", res.id);

    if (this.competanceNames.length > 0) {
     
      this.competanceNames.forEach(competance => {
        const competanceEmp = new Competence();
        competanceEmp.nom = competance.nom;
        this.idPoste=res.id;

        
        competanceEmp.jobPosition = { id: this.idPoste }; //jobPosition  ID

        console.log("Competence to Add:", competanceEmp);

        this.competanceservice.addCompetence(competanceEmp).subscribe((result) => {
          console.log("Competence added:", result);
        }, error => {
          console.error("Error adding competence:", error);
        });
      });
    } else {
      console.warn("No competence names to add.");
    }
    this.getAllPostes();
    
  }, error => {
    console.error("Error adding job position:", error);
  });
  //this.getAllPostes();
 }else{
  this.jobpositionService.updateJobPosition(idPoste, this.poste).subscribe((res: JobPosition) => {
    console.log("mise à jour du poste :", res);
  

  competanceNames=[]
  this.getCompetanceNames(competanceNames);
  console.log(competanceNames)
  if (competanceNames.length > 0) {
    
  competanceNames.forEach(competance => {
    const competanceEmp = new Competence();
    if (competance.id == null) {
      // Add new competence
     
      competanceEmp.nom = competance.nom;
      competanceEmp.jobPosition = { id: this.idPoste }; // Assign jobPosition ID

      console.log("Competence to Add:", JSON.stringify(competanceEmp));

      this.competanceservice.addCompetence(competanceEmp).subscribe(
        (result) => {
          console.log("Competence added:", JSON.stringify(result));
        },
        (error) => {
          console.error("Error adding competence:", error);
        }
      );
    } else {
      // Update existing competence
      //const competanceEmp = new Competence();
      competanceEmp.nom = competance.nom;
      competanceEmp.id = competance.id;
      competanceEmp.jobPosition={id:this.idPoste}

      console.log("Competence to Update:", JSON.stringify(competanceEmp));

      this.competanceservice.updateCompetence(competanceEmp.id, competanceEmp).subscribe(
        (data) => {
          console.log("Competence updated:", JSON.stringify(data));
        },
        (error) => {
          console.error("Error updating competence:", error);
        }
      );
    }
  });
 
  }
  this.getAllPostes();

    }, error => {
    console.error("Erreur mise à jour du poste :", error);
  
  });
}

}

resetForm() {
  this.competanceData.reset();
  this.competancedata().clear();
  this.idPoste = null;
  this.competanceNames=[];
  // If you need to reset to initial state with empty competence
  this.poste= new JobPosition();
}

deletePoste(id: number) {
    
      this.jobpositionService.deleteJobPosition(id).subscribe( (res) => {
        console.log(res);
        this.getAllPostes();
      })
 
  
}

posteDetails(id: number){
  this.router.navigate(['/admin/poste/', id]);
}

}

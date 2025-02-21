import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { JobPosition } from 'src/app/core/models/JobPosition';
import { ServiceEq } from 'src/app/core/models/ServiceEq';
import { User } from 'src/app/core/models/User';
import { UserType } from 'src/app/core/models/UserType';
import { ServiceEqService } from 'src/app/core/services/ServiceEq.service';
import { UserService } from 'src/app/core/services/User.service';

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.scss']
})
export class EmployeComponent implements OnInit {

  Users: User[] = [];
  currentEmploye: User=new User();
  servicesEq : ServiceEq;
  userServiceEqs: { userId: number, serviceEq: ServiceEq | null }[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 5; // Nombre d'éléments par page
  totalItems: number = 0;
  UserType = UserType;

  jobPositions: { [userId: number]: string } = {};


  constructor(private userService: UserService,private serviceEqserice : ServiceEqService ,private router: Router) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe((res: User[]) => {
      console.log(res);
      this.Users = res;
      this.totalItems = this.Users.length;
      this.Users.forEach(user => {
        this.userService.getServiceEqByUserId(user.id).subscribe((serviceEq: ServiceEq) => {
          user.serviceEq = serviceEq; // Associate serviceEq with the user
          console.log(`Service Eq for User ID ${user.id}:`, serviceEq);
        });

          this.serviceEqserice.getServiceEqByChefId(user.id).subscribe((serviceEq: ServiceEq) => {
            user.chefEquipeService = serviceEq; // Associate serviceEq with the user
            console.log(`Service Eq for User ID ${user.id}:`, serviceEq);
          });

          this.getPosteNom(user.id);

          
       
      });
    });
  }

  getPosteNom(userId: number): void {
    this.userService.getJobPositionForUser(userId).subscribe(
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

  
  addEmploye() {
    this.router.navigate(['/dashboard/admin/addempl']); // Navigue vers le composant Employe pour ajouter un nouvel employé
  }

  editEmploye(employe: User) {
    this.router.navigate(['/dashboard/admin/addempl', employe.id]); // Navigue vers le composant Employe pour mettre à jour l'employé
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.Users.slice(start, end);
  }

  setPage(page: number) {
    if (page < 1 || page > Math.ceil(this.totalItems / this.itemsPerPage)) return;
    this.currentPage = page;
  }
  get pages(): number[] {
    return Array(Math.ceil(this.totalItems / this.itemsPerPage)).fill(0).map((_, i) => i + 1);
  }

  deleteEmploye(id: number){
    this.userService.getUserById(id).subscribe(res=>{
      this.currentEmploye=res
    })
    this.currentEmploye.serviceEq=null
    this.userService.updateUser(id,this.currentEmploye).subscribe(res=>{
      console.log(res)
    })
    this.userService.deleteUser(id).subscribe( (data) => {
      console.log(data);
      this.getAllUsers();
    })
  }
  employeDetails(id: number){
    this.router.navigate(['/employe/profile/', id]);
  }
  chefdequipeDetails(id: number){
    this.router.navigate(['/chefdequipe/profile/', id]);
  }


 

}

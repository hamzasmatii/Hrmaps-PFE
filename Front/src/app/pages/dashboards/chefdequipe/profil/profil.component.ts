import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceEq } from 'src/app/core/models/ServiceEq';
import { User } from 'src/app/core/models/User';
import { ServiceEqService } from 'src/app/core/services/ServiceEq.service';
import { UserService } from 'src/app/core/services/User.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  user: User;
  idUser:number;

  constructor(private userService: UserService,private router: Router,private route: ActivatedRoute,private serviceEqserice : ServiceEqService) { }

  ngOnInit(): void {
    this.idUser = +this.route.snapshot.params['id'];
    this.getUserById(this.idUser);
    
  }
  getUserById(id: number): void {
    this.userService.getUserById(id).subscribe((res: User) => {
      this.user = res;

      if (this.user) {
        this.serviceEqserice.getServiceEqByChefId(this.user.id).subscribe((serviceEq: ServiceEq) => {
          this.user.chefEquipeService = serviceEq; // Associate serviceEq with the user
          console.log(`Service Eq for User ID ${this.user.id}:`, serviceEq);
        });
      }
    });
  }

}

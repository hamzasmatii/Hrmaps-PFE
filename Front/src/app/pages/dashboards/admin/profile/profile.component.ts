import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/core/models/User';
import { UserService } from 'src/app/core/services/User.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User;
  idUser:number;

  constructor(private userService: UserService,private router: Router,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.idUser = +this.route.snapshot.params['id'];
    this.getUserById(this.idUser);
    
  }
  getUserById(id: number): void {
    this.userService.getUserById(id).subscribe((res: User) => {
      this.user = res;

      
    });
  }


}

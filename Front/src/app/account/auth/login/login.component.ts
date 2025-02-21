import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



import { ActivatedRoute, Router } from '@angular/router';
import { first, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/core/services/User.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {
  errr: string;
  form: FormGroup;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  year: number = new Date().getFullYear();

  constructor(
    private authService: UserService, // Inject your AuthService
    private route: Router,
    private fb: FormBuilder,private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      matriculeP: [""],
      password: [""]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const { matriculeP, password } = this.form.value;

    this.authService.login(matriculeP, password).subscribe(
      success => {
        if (success) {
          this.isLoggedIn = true;
          this.isLoginFailed = false;

          const role = this.authService.getRole();
          const idUser = this.authService.getIduser();

          // Redirect based on user role
          if (role === 'ADMIN') {
            this.route.navigate(['/dashboard/admin/serviceEq']);
          } else if (role === 'CHEF_EQUIPE') {
            this.route.navigate(['/dashboard/chefdequipe/profile/' + idUser]);
          } else if (role === 'EMPLOYE') {
            this.route.navigate(['/dashboard/employe/profile/' + idUser]);
          }
        } else {
          this.isLoginFailed = true;
          this.errr = 'Invalid credentials';
        }
      },
      error => {
        this.isLoginFailed = true;
        this.errr = 'An error occurred during login';
      }
    );
  }
  reloadPage(): void {
    window.location.reload();
  }
}

/* */

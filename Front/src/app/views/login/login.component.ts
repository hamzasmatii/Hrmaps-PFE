import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { TokenStorage } from 'src/app/core/services/tokenservice.service';
import { Auth2Service } from 'src/app/core/services/auth2.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {
  errr: string

  form: FormGroup
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  year: number = new Date().getFullYear();

  constructor(
    private authService: Auth2Service,
    private tokenStorage: TokenStorage,
    private route: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }

    this.form = this.fb.group({
      matriculeP: [""],
      password: [""]
    })
  }

  onSubmit(): void {



    this.authService.login(this.form.value).subscribe(
      (data) => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        // localStorage.setItem("us",username);
        this.route.navigate(["/dashboard"])
        this.isLoginFailed = false;
        this.isLoggedIn = true;

        if (data) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Bienvenu à notre espace ' + this.tokenStorage.getUser().role_portail,
            showConfirmButton: false,
            timer: 3000
          });
        }




        /* this.toast.success({
           detail: ' Success Message',
           summary: data.message,
           duration: 5000,
         });*/
      },
      (err) => {
        this.errr = "Veuillez vérifier votre matricule ou mot de passe"
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }
}

/* */

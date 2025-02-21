import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from './User.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles: string[] = route.data.expectedRole; // Get the list of allowed roles
    const currentRole = this.authService.getRole(); // Get the current user's role

    if (expectedRoles.includes(currentRole)) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']); // Redirect to an unauthorized page or fallback page
      return false;
    }
  }
}

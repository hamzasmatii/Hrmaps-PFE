import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceEqComponent } from './admin/components/service-eq/service-eq.component';
import { EmployeComponent } from './admin/components/employe/employe-list/employe.component';
import { AddEmployeComponent } from './admin/components/employe/add-employe/add-employe.component';
import { EmployeDetailComponent } from './employe/employe-detail/employe-detail.component';
import { ProfilComponent } from './chefdequipe/profil/profil.component';
import { ServiceEqDetailComponent } from './chefdequipe/service-eq-detail/service-eq-detail.component';
import { PosteComponent } from './admin/poste/poste.component';
import { PosteDetailComponent } from './admin/poste/poste-detail/poste-detail.component';
import { CalendarComponent } from './admin/components/employe/formation/calendar/calendar.component';
import { CalandarDatailComponent } from './employe/calandar-datail/calandar-datail.component';
import { RoleGuard } from 'src/app/core/services/RoleGuard';



const routes: Routes = [
  {
    path: 'admin',
    canActivate: [RoleGuard],
    data: { expectedRole: 'ADMIN' },
    children: [
      { path: 'serviceEq', component: ServiceEqComponent },
      { path: 'employe', component: EmployeComponent },
      { path: 'calendrier', component: CalendarComponent },
      { path: 'addempl', component: AddEmployeComponent },
      { path: 'addempl/:id', component: AddEmployeComponent },
      { path: 'poste', component: PosteComponent },
      { path: 'poste/:id', component: PosteDetailComponent },
      { path: '', redirectTo: 'serviceEq', pathMatch: 'full' } // Redirect to default route if none specified
    ]
  },
  {
    path: 'employe',
    canActivate: [RoleGuard],
    data: { expectedRole: ['ADMIN', 'CHEF_EQUIPE','EMPLOYE'] },
    children: [
      { path: 'profile/:id', component: EmployeDetailComponent },
      { path: 'calendrier/:id', component: CalandarDatailComponent },
      { path: '', redirectTo: 'profile/:id', pathMatch: 'full' } // Redirect to default route if none specified
    ]
  },
  {
    path: 'chefdequipe',
    canActivate: [RoleGuard],
    data: { expectedRole: ['ADMIN', 'CHEF_EQUIPE'] },
    children: [
      { path: 'profile/:id', component: ProfilComponent },
      { path: 'serviceEq/:id', component: ServiceEqDetailComponent },
      { path: '', redirectTo: 'profile/:id', pathMatch: 'full' } // Redirect to default route if none specified
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardsRoutingModule {}

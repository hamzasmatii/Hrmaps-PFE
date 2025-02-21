import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceEqComponent } from './dashboards/admin/components/service-eq/service-eq.component';


const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  // Other routes if needed
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }

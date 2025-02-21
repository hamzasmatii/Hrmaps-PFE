import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { Page404Component } from './extrapages/page404/page404.component';

const routes: Routes = [
  // Redirect the root path to the login page
  { path: '', redirectTo: '/account/login', pathMatch: 'full' },
  
  // Lazy load the account module which includes the login page
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  
  // All routes under `LayoutComponent` after login
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
  },

  // Catch-all for unknown routes to show a 404 page
  { path: '**', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

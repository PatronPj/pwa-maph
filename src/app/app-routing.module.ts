import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../app/dashboard/dashboard.component';
import { LoginComponent } from '../app/login/login.component';
import { FaqComponent } from '../app/faq/faq.component';
import { TodaysdetailComponent } from '../app/todaysdetail/todaysdetail.component';

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent },
  {path: 'faq', component: FaqComponent },
  {path: 'today', component: TodaysdetailComponent },
  {path: '', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [DashboardComponent, LoginComponent]
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './comp/home/home.component';
import { RigsComponent } from './comp/rigs/rigs.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'rigs', component: RigsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

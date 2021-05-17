import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './comp/home/home.component';
import { MachineComponent } from './comp/machine/machine.component';
import { RigsComponent } from './comp/rigs/rigs.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'rigs', component: RigsComponent},
  {path: 'machine', component: MachineComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

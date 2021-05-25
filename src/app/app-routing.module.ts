import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './comp/home/home.component';
import { MachineComponent } from './comp/machine/machine.component';
import { RigsComponent } from './comp/rigs/rigs.component';
import { CustomersComponent } from './comp/customers/customers.component'
import { ClienteComponent } from './comp/cliente/cliente.component'
import { TechniciansComponent } from './comp/technicians/technicians.component'
import { FilesComponent } from './comp/files/files.component'


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'rigs', component: RigsComponent},
  {path: 'machine', component: MachineComponent},
  {path: 'customers', component: CustomersComponent},
  {path: 'cliente', component: ClienteComponent},
  {path: 'technicians', component: TechniciansComponent },
  {path: 'files', component: FilesComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

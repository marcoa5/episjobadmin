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
import { NewcustComponent } from './comp/newcust/newcust.component'
import { NewtechComponent } from './comp/newtech/newtech.component'
import { NewrigComponent } from './comp/newrig/newrig.component'
import { UsersComponent } from './comp/users/users.component'


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'rigs', component: RigsComponent},
  {path: 'machine', component: MachineComponent},
  {path: 'customers', component: CustomersComponent},
  {path: 'cliente', component: ClienteComponent},
  {path: 'technicians', component: TechniciansComponent },
  {path: 'files', component: FilesComponent },
  {path: 'newc', component: NewcustComponent },
  {path: 'newtech', component: NewtechComponent },
  {path: 'newrig', component: NewrigComponent },
  {path: 'users', component: UsersComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

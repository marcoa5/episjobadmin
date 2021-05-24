import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'episjob-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  buttons:any = [
    {id:'Users',icon:'account_box', route:'users', dis:true},
    {id:'Customers',icon:'work', route:'customers', dis:false},
    {id:'Rigs',icon:'precision_manufacturing', route:'rigs', dis:false},
    {id:'Technicians',icon:'handyman', route:'technicians', dis:false},
    {id:'Files',icon:'cloud_download', route:'files', dis:true},
    {id:'Contracts',icon:'description', route:'contracts', dis:true},

  ];

  constructor(public router :Router) { }
  ngOnInit(): void {
  }

  nav(route:string){
    this.router.navigate([route])
  }  
}

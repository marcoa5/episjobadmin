import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'episjob-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  buttons:any = [
    {id:'Users',icon:'account_box', route:'users'},
    {id:'Customers',icon:'work', route:'customers'},
    {id:'Rigs',icon:'precision_manufacturing', route:'rigs'},
    {id:'Technicians',icon:'handyman', route:'tech'},
    {id:'Files',icon:'cloud_download', route:'files'},
    {id:'Contracts',icon:'description', route:'contracts'},

  ];
  constructor(public router :Router) { }
  t:number | undefined;
  ngOnInit(): void { 
    this.t= Math.floor(window.innerWidth/150)
  }

  nav(route:string){
    this.router.navigate([route])
  }

  resize(){
    this.t= Math.floor(window.innerWidth/150)
    return this.t 
  }
}

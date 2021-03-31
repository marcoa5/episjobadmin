import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs'

@Component({
  selector: 'episjob-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  buttons:any = [
    {id:'Users',icon:'account_box'},
    {id:'Customers',icon:'work'},
    {id:'Rigs',icon:'precision_manufacturing'},
    {id:'Technicians',icon:'handyman'},
    {id:'Files',icon:'cloud_download'},
  ];
  constructor() { }

  ngOnInit(): void { 
    
  }


}

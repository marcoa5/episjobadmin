import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { BackService }  from '../../serv/back.service'
import firebase from 'firebase'
import 'firebase/database'

@Component({
  selector: 'episjob-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  filtro:any=''
  customers:any;
  constructor(public router: Router, public bak:BackService) { }

  ngOnInit(): void {     
    firebase.database().ref('Customers').once('value', a=>{
      this.customers = Object.values(a.val())
    })
  }

  open(a: String, b:string, c:string){
    this.router.navigate(['cliente',{cust1:a, cust2:b, cust3:c}])
  }

  
  back(){
    this.bak.backP()
  }

  filter(a:any){
    this.filtro=a
  }  
}

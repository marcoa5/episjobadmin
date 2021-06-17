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
  pos:string='';
  ind:number=0
  constructor(public router: Router, public bak:BackService) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref('Users/' + a?.uid).once('value',b=>{
        this.pos=b.val().Pos
        this.ind=b.val().Area
      }).then(()=>{
        if(this.pos!='sales'){
          firebase.database().ref('Customers').on('value', a=>{
            this.customers = Object.values(a.val())
          })
        } else {
          
        }
      })
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

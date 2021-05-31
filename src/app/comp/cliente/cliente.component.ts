import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import firebase from 'firebase'
import 'firebase/database'
import { BackService } from '../../serv/back.service'

export interface rigsLabel {
  lab: string
  value: any
  click: any
  url: any
}

@Component({
  selector: 'episjob-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {
  cust1:string=''
  cust2: string|undefined
  cust3: string|undefined
  custrig:any[]|undefined
  infoLabels:rigsLabel[]=[]
  rigsLabels:rigsLabel[]=[]
  constructor(public route: ActivatedRoute, private bak: BackService, private router: Router) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(a=>{
      
    })
    this.route.params.subscribe(a=>{
      this.cust1=a.cust1
      console.log(this.cust1.replace(/./g,''))
      firebase.database().ref('Customers/' + this.cust1).once('value', g=>{
        this.cust2=g.val().c2
        this.cust3=g.val().c3
        this.infoLabels =[
          {value:this.cust1,lab:'Customer Name',click:'', url:''},
          {value:g.val().c2,lab:'Address 1',click:'', url:''},
          {value:g.val().c3,lab:'Address 2',click:'', url:''}
        ]
      })
    })
    firebase.database().ref('MOL').orderByChild('customer').equalTo(this.cust1).once('value',k=>{
      if(k.val()!=null){
        this.custrig=Object.values(k.val())
          k.forEach(x=>{
          this.rigsLabels.push({value: x.val().model,lab:x.val().sn,click:x.val().sn, url:'machine'})
        })
      } 
      
    })
  }

  back(){
    this.bak.backP()
  }


}

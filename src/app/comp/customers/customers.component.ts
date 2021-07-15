import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { BackService }  from '../../serv/back.service'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

@Component({
  selector: 'episjob-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  filtro:any=''
  customers:any[]=[];
  pos:string='';
  ind:number=0
  custSales:string[]=[]
  rigSn:string[]=[]
  constructor(public router: Router, public bak:BackService) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref('Users/' + a?.uid).once('value',b=>{
        this.pos=b.val().Pos
        this.ind=b.val().Area?.toString()
      })
      .then(()=>{
        if(this.pos!='sales'){
          firebase.database().ref('CustomerC').once('value', g=>{
            this.customers = Object.values(g.val())
          })
        } else {
          firebase.database().ref('RigAuth').orderByChild('a' + this.ind).equalTo('1').once('value',a=>{
            Object.keys(a.val()).map(b=>{
              firebase.database().ref('MOL').child(b).child('custid').once('value',c=>{
                if(c.val()==null) console.log(b)
                let nb=c.val()//.replace(/\./g,'').replace('/00','').replace('/','').replace(' & ','')
                firebase.database().ref('CustomerC').child(nb).once('value',d=>{
                  if(d.val()!==null && !this.custSales.includes(nb)) {
                    this.custSales.push(nb)
                    this.customers.push(d.val())
                  }
                })
              })
            })
          })
        } 
      })
    })
  }

  open(a: String, b:string, c:string, d:string){
    this.router.navigate(['cliente',{id:d}])
  }

  
  back(){
    this.bak.backP()
  }

  filter(a:any){
    this.filtro=a
  }  

  
}

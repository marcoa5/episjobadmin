import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

@Component({
  selector: 'episjob-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  pos:string|undefined
  rigs:any[]=[]
  rigs1:any[]=[]
  filtro:string=''
  wid:boolean=true
  elenco:string=''
  start:number=0
  end:number=10

  constructor(private router: Router) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref('Users/' + a?.uid).child('Pos').once('value',b=>{
        this.pos = b.val()
      })
    })
    firebase.database().ref('MOL')
    .once('value',a=>{
      a.forEach(b=>{
        firebase.database().ref('RigAuth/' + b.val().sn).once('value',c=>{
          this.rigs.push({
            sn: b.val().sn, 
            customer: b.val().customer,
            model: b.val().model,
            site: b.val().site,
            a1: c.val().a1,
            a2: c.val().a2,
            a3: c.val().a3,
            a4: c.val().a4,
            a5: c.val().a5,
          })
        }).then(()=>{
          this.rigs1=this.rigs.slice(this.start,this.end)
        })
      })
    })
  }

  filter(a:any){
    if(a!=''){
      this.filtro=a
      this.rigs1 = this.rigs
    } 
    if (a=='') {
      this.filtro=''
      this.start=1
      this.end =10
      this.rigs1 = this.rigs.slice(0,10)
    }
  }

  cl(e:any, a:string, b:string){
    let g = e.checked? 1 : 0
    firebase.database().ref('RigAuth/' + a).child(b).set(g)
  }

  res(){
    if(window.innerWidth<600) {
      this.wid=false
    } else {
      this.wid=true
    }
  }

  go(a:String, b:string){
    if(b=='sn') this.router.navigate(['machine', {sn: a}])
    if(b=='cu') this.router.navigate(['cliente', {cust1: a}])
  }

  checkWidth(){
    if(window.innerWidth>650) return true
    return false
  }

  pageEvent(e:any){
    this.start = e.pageIndex * e.pageSize 
    this.end = e.pageIndex* e.pageSize + e.pageSize
    this.rigs1=this.rigs.slice(this.start,this.end)
  }


}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { MatPaginatorIntl } from '@angular/material/paginator'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

@Component({
  selector: 'episjob-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  pos:string=''
  rigs:any[]=[]
  rigs1:any[]=[]
  filtro:string=''
  wid:boolean=true
  elenco:string=''
  start:number=0
  end:number=10
  allow: boolean=false
  auth:string[]=[]
  allSpin:boolean=true

  constructor(private router: Router, private paginator: MatPaginatorIntl, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(a=>this.auth=a.auth.split(','))
    this.paginator.itemsPerPageLabel='#'
    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref('Users/' + a?.uid).child('Pos').once('value',b=>{
        this.pos = b.val()
        if(this.auth.includes(this.pos)) this.allow=true
      })
      .then(()=>this.allSpin=false)
    })
    firebase.database().ref('MOL')
    .once('value',a=>{
      a.forEach(b=>{
        firebase.database().ref('RigAuth/' + b.val().sn).once('value',c=>{
          try{
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
              a98: c.val().a98,
              a99: c.val().a99,
            })
          }
          catch{
            console.log(b.val())
          }
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

  cl(e:any, a:string, b:string, i:number){
    let g = e.checked? 1 : 0
    this.rigs1[i][b]=g
    this.rigs.forEach(x=>{
      if(x.sn==a){x[b]=g}
    })
    firebase.database().ref('RigAuth/' + a).child(b).set(g.toString())
  }

  res(){
    if(window.innerWidth<600) {
      this.wid=false
    } else {
      this.wid=true
    }
  }

  go(a:String, b:string){
    let custId:string=''
    if(b=='sn') this.router.navigate(['machine', {sn: a}])
    firebase.database().ref('CustomerC').once('value',h=>{
      let g:any = Object.values(h.val())
      g.forEach((r: any)=>{
        //console.log(a,r.c1)
        if(r.c1==a) custId=r.id
      })
    })
    .then(()=>{
      if(b=='cu' && custId!='') this.router.navigate(['cliente', {id: custId}])
    })
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

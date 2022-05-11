import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { MatPaginatorIntl } from '@angular/material/paginator'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';

@Component({
  selector: 'episjob-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  pos:string=''
  rigs:any[]=[]
  access:any[]=[]
  rigs1:any[]=[]
  filtro:string=''
  wid:boolean=true
  elenco:string=''
  start:number=0
  end:number=10
  allow: boolean=false
  allSpin:boolean=true
  subsList:Subscription[]=[]

  constructor(private auth: AuthServiceService, private router: Router, private paginator: MatPaginatorIntl, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.paginator.itemsPerPageLabel='#'
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        setTimeout(() => {
          this.allow=this.auth.allow('Admin', this.pos)
          this.allSpin=false
        }, 1);
      }),
      this.auth._rigs.subscribe(a=>this.rigs=a),
      this.auth._accessI.subscribe(a=>{
        this.access=a
        if(a && this.rigs.length>0){
          this.rigs1 = this.rigs.map(a=>{
            a['a1']=this.access[a.sn].a1
            a['a2']=this.access[a.sn].a2
            a['a3']=this.access[a.sn].a3
            a['a4']=this.access[a.sn].a4
            a['a5']=this.access[a.sn].a5
            a['a98']=this.access[a.sn].a98
            a['a99']=this.access[a.sn].a99
            return a
          }).slice(this.start,this.end)
        }})
    )    
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
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

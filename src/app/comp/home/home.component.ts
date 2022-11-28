import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';


@Component({
  selector: 'episjob-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  pos:string=''
  subPos:string=''
  fil:string=''
  nome:string=''
  spin:boolean=true
  serverM:any
  serverC:any
  localM:any
  localC:any
  fleetUptodate:boolean|undefined
  custUptodate:boolean|undefined
  inter:any
  role:string=''
  buttons:any = [
    {
      id:'Equipment',
      icon:'precision_manufacturing', 
      route:'rigs', 
      auth:['SU','admin','adminS','tech','techwsadmin','sales','customer','wsadmin']
    },
    {
      id:'Companies',
      icon:'work', 
      route:'customers', 
      auth:['SU','admin','adminS','tech','techwsadmin','sales','customer','wsadmin']
    },
    {
      id:'ServiceJob',
      icon:'text_snippet', 
      route:'sj', 
      auth:['SU','admin','adminS','tech','techwsadmin','wsadmin']
    },
    {
      id:'Parts',
      icon:'construction', 
      route:'parts', 
      dis:false, 
      auth:['SU','admin','adminS','tech','customer','techwsadmin','wsadmin']
    },
    {
      id:'Files',
      icon:'cloud_download', 
      route:'files', 
      dis:false, 
      auth:['SU','admin','adminS','tech','']
    },
    {
      id:'Visit',
      icon:'recent_actors', 
      route:'visit', 
      dis:false, 
      auth:['SU','adminS','sales','']
    },
    {
      id:'People',
      icon:'account_box', 
      route:'contacts', 
      dis:false, 
      auth:['SU','admin','adminS','sales','tech']
    },
    {
      id:'Technicians',
      icon:'handyman', 
      route:'technicians', 
      dis:false, 
      auth:['SU','admin','','']
    },

    {
      id:'Users',
      icon:'people', 
      route:'users', 
      dis:false, 
      auth:['SU','','','']
    },
    {
      id:'Access',
      icon:'done_all', 
      route:'auth', 
      dis:false, 
      auth:['SU','admin','adminS','','']
    },
    {
      id:'Report',
      icon:'receipt_long', 
      route:'report', 
      dis:false, 
      auth:['SU','','','']
    },
    {
      id:'Contracts',
      icon:'class', 
      route:'contracts', 
      dis:false, 
      auth:['SU','admin','adminS','sales','tech']
    },
    {
      id:'Workshop',
      icon:'home_work', 
      route:'workshop', 
      dis:false, 
      auth:['SU','admin','adminS','techwsadmin','wsadmin']
    },
    {
      id:'Pricing',
      icon:'sell', 
      route:'pricing', 
      dis:false, 
      auth:['SU']
    },
  ];
  rigs:any[]=[]
  chOffline:boolean=false
  offLine:boolean|undefined
  customers:any[]=[]
  wide:boolean=false
  subsList: Subscription[]=[]
  uId:string=''
  constructor(public router :Router, public auth:AuthServiceService) {}
  
  async ngOnInit() {
    this.onResize()
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        this.nome = a.Nome + ' ' + a.Cognome
        this.spin=false
        this.uId=a.uid
        switch(a.Pos) {
          case 'SU':  this.role='SuperUser'; break;
          case 'admin': this.role='Technical Admin'; break;
          case 'adminS': this.role='Sales Admin'; break;
          case 'tech': this.role='Technician'; break;
          case 'sales': this.role='Sales man'; break;
          case 'customer': this.role='Customer'; break;
          case 'wsadmin':  this.role='Workshop admin'; break;
        }
      })
    )
    await this.addFleetSubscription()
    await this.addCustSubscription()
    if(navigator.onLine){
      this.chOffline=false
    }else {
      this.chOffline=true
    }
    if(localStorage.getItem('Fleetupd')==undefined) localStorage.removeItem('Fleetupd')
    if(localStorage.getItem('Fleetupd')==undefined) localStorage.removeItem('Custupd')
    setInterval(()=>{
      if(navigator.onLine){
        this.chOffline=false
      }else {
        this.chOffline=true
      }
      this.chMOLstatus()
      this.chCustSatus()
    }, 2000)
    firebase.database().ref('Updates').child('MOLupd').on('value',m=>{
      if(m.val()!=null) this.serverM = m.val() 
    })
    firebase.database().ref('Updates').child('Custupd').on('value',m=>{
      if(m.val()!=null) this.serverC = m.val()
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if(window.innerWidth<650) {
      this.wide=false
    } else{
      this.wide=true
    }
  }

  addFleetSubscription(){
    return new Promise(res=>{
      this.subsList.push(
        this.auth._fleet.subscribe(a=>{
          if(a) {
            this.rigs=a
            res('')
          }
        }),
      )
    })
  }

  addCustSubscription(){
    return new Promise(res=>{
      this.auth._customers.subscribe(t=>{
        if(t) {
          this.customers=t
          res('')
        }
      })
    })
  }

  chMOLstatus(){
    this.localM=undefined
    if(!navigator.onLine){
      this.fleetUptodate=undefined
    } else {
      this.localM=localStorage.getItem('Fleetupd')
      this.chMOLupd()
    }
  }

  chCustSatus(){
    this.localC=undefined
    if(!navigator.onLine){
      this.custUptodate=undefined
    } else {
      this.localC=localStorage.getItem('Custupd')
      this.chCustupd()
    }
    
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})

  }
  
  nav(route:string, au:any){
    this.router.navigate([route])
  }  

  contr(a:string[]):boolean{
    if(a.includes(this.pos? this.pos:'')) return false
    return true
  }

  chMOLupd(){
    if(navigator.onLine){
      if(this.localM && this.serverM && this.localM==this.serverM){
        this.fleetUptodate= true
      } else {
        this.fleetUptodate= false
      }
    } else{
      this.fleetUptodate=undefined
    }
  }

  chCustupd(){
    if(navigator.onLine){
      if(this.localC && this.serverC && this.localC==this.serverC){
        this.custUptodate= true
      } else {
        this.custUptodate= false
      }
    } else {
      this.custUptodate= undefined
    }
    
  }
  
  updateMOL(){
    let res= this.auth._rigs.subscribe(a=>{
      if(a) {}
    })
    setTimeout(() => {
      res.unsubscribe()
      this.chMOLstatus()
    }, 200);
  }

  updateCust(){
    let res= this.auth._customers.subscribe(a=>{
      if(a) {}
    })
    setTimeout(() => {
      res.unsubscribe()
      this.chCustSatus()
    }, 200);
  }
}
 
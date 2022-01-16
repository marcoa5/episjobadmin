import { Injectable } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import * as moment from 'moment'
import {openDB} from 'idb'

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  epiRigs:any[]=[]
  epiFleet:any[]=[]
  epiAuth:any[]=[]
  epiCateg:any[]=[]
  epiUser:any
  epiCustomers:any[]=[]
  epiUserId:string=''
  epiContact:any[]=[]

  constructor() {
    firebase.initializeApp({
      apiKey: "AIzaSyBtO5C1bOO70EL0IPPO-BDjJ40Kb03erj4",
      authDomain: "epi-serv-job.firebaseapp.com",
      databaseURL: "https://epi-serv-job-default-rtdb.firebaseio.com",
      projectId: "epi-serv-job",
      storageBucket: "epi-serv-job.appspot.com",
      messagingSenderId: "793133030101",
      appId: "1:793133030101:web:1c046e5fcb02b42353a05c",
      measurementId: "G-Y0638WJK1X"
    })
    try{
      firebase.auth().onAuthStateChanged(r=>{
        if(r!=null){
          console.log('online')
          this.userData.next(['loading'])
          firebase.database().ref('Users').child(r!.uid).on('value',b=>{
            if(b.val()!=null){
              let c= b.val()
              c['uid']=r!.uid
              localStorage.setItem('user',JSON.stringify(c))
              this.userData.next(c)
              let time:string = moment(new Date).format('YYYY-MM-DD HH:mm:ss')
              firebase.database().ref('Login').child(c.uId+'-'+c.Nome + ' ' + c.Cognome).child(time).set({Login: time})
            }
          })
        } else{
          this.userData.next(['login'])
        }
      })
    } catch {
      console.log('network error')
    }
    
  }

 

  private rigs:Subject<any>=new BehaviorSubject<any>([])
  private access:Subject<any>=new BehaviorSubject<any>([])
  private accessI:Subject<any>=new BehaviorSubject<any>([])
  private categ:Subject<any>=new BehaviorSubject<any>([])
  private fleet:Subject<any>=new BehaviorSubject<any>([])
  private userData:Subject<any>=new BehaviorSubject<any>([])
  private customers:Subject<any>=new BehaviorSubject<any>([])
  private contacts:Subject<any>=new BehaviorSubject<any>([])
  private custI:Subject<any>=new BehaviorSubject<any>(undefined)
  
  get _rigs(){this.getFleetData(); return this.rigs.asObservable()}

  get _access(){return this.access.asObservable()}
  get _accessI(){this.getAccess(); return this.accessI.asObservable()}

  get _categ(){return this.categ.asObservable()}

  get _userData(){
    let a=localStorage.getItem('user')
    let b:any
    
    if(a!=null) {
      b = JSON.parse(a)
      console.log(b)
      this.userData.next(b)
      this.epiUser=b
      this.epiUserId=b.uid
    } else {
      this.userData.next(['login'])
    }
      return this.userData.asObservable()
  }

  get _fleet(){this.getFleetData(); return this.fleet.asObservable()}
  
  get _customers(){this.getCustData(); return this.customers.asObservable()}

  get _contacts(){return this.contacts.asObservable()}

  get _custI(){this.getCustData(); return this.custI.asObservable()}

  getFleetData(){//modifica qui
    if(this.epiUser){
      if(this.epiUser.Pos!='sales' && this.epiUser.Pos!='customer'){
        if(this.epiRigs.length==0){
          firebase.database().ref('MOL').on('value',async (a)=>{
            let b=Object.values(a.val())
            const db = await openDB('db')
            if (db.objectStoreNames.contains('rigs')) {
              db.createObjectStore('rigs');
            }
            this.rigs.next(b)
            this.epiRigs=b
            this.getFleet(this.epiRigs,this.epiCateg)
          })
          
          firebase.database().ref('Categ').on('value',a=>{
            let cat:any[] = []
            a.forEach((b:any)=>{
              cat[b.key]=b.val().subCat
            })
            this.categ.next(cat)
            this.epiCateg=cat
            this.getFleet(this.epiRigs,this.epiCateg)
          })
        }
      } else if(this.epiUser.Pos=='sales' || this.epiUser.Pos=='customer'){
        let area:string = this.epiUser.Area
        let list:any[]=[]
        firebase.database().ref('MOL').on('value',a=>{
          a.forEach(b=>{
            let item:any
            firebase.database().ref('RigAuth').child(b.val().sn).child('a'+area).once('value',r=>{
              if(r.val()=='1') {
                item=b.val()
                firebase.database().ref('Categ').child(b.val().sn).child('subCat').once('value',r=>{
                  if(r!=null) item['categ']=r.val()
                })
                .then(()=>{
                  list.push(item)
                })
              }
            })
          })
          setTimeout(() => {
            this.rigs.next(list)
            this.epiRigs=list
            this.getFleet(this.epiRigs)
          }, 1500);
            
        })
      }
    }
  }

  getFleet(fRigs:any[],fCateg?:any){
    if(fCateg){
      let g:any[] = fRigs.map(a=>{
        a['categ']=fCateg[a.sn]
        return a
      })
      if(g.length==fRigs.length){
        this.epiFleet=g
        this.fleet.next(g)
      }
    } else {
      this.epiFleet=fRigs
      this.fleet.next(fRigs)
    }
    
  }

  getCustData(){
    if(this.epiUser){
      if(this.epiUser.Pos!='customer'){
        if(this.epiCustomers.length==0){
          let custIndex
          firebase.database().ref('CustomerC').on('value',a=>{
            custIndex=a.val()
            let b:any[]=[]
            let rt:any[]=[]
            if(this.epiUser){
              b=Object.values(a.val())
              b.sort((a: any, b: any) => {
                if (a['c1'] < b['c1']) {
                  return -1;
                } else if (a['c1'] > b['c1']) {
                  return 1;
                } else {
                  return 0;
                }
              })
              let c:any[]
              if(this.epiUser.Pos=='customer'){
                c = b.filter(t=>{
                  if(this.epiFleet.map(t=>{return t.custid}).includes(t.id)) return t
                })
                
              } else{
                c=b
              }
              this.customers.next(c)
              this.custI.next(custIndex)
              this.epiCustomers=c 
            }
          })
        }
      } else {
         this._fleet.subscribe(a=>{
           if(a.length>0){
            let cu:any=[]
            let cuI:any=[]
            let i:number=0
            new Promise((res,rej)=>{
              a.forEach((e:any) => {
                firebase.database().ref('CustomerC').child(e.custid).once('value',y=>{
                  if(y!=null && cu.map((r:any)=>{return r.id}).indexOf(e.custid)==-1) {
                    cu.push(y.val())
                    cuI[e.custid]=y.val()
                  }
                })
                .then(()=>{
                  i++
                  if(i==a.length) res('')
                })
                
              })
            })
            .then(() => {
              this.customers.next(cu)
              this.custI.next(cuI)
              this.epiCustomers=cu
            });
           }
         }) 
      }
    }
  }

  getContact(){
    firebase.database().ref('Contacts').on('value',a=>{
      let b:any[]=[]
      a.forEach(c=>{
        c.forEach(d=>{
          let t = d.val()
          t.id=c.key
          b.push(t)
        })
      })
      this.contacts.next(b)
      this.epiContact=b
    })
  }

  getAccess(){
    if(this.epiAuth.length==0){
      firebase.database().ref('RigAuth').on('value',a=>{
        this.epiAuth=a.val()
        this.accessI.next(a.val())
      })
    }
  }

  getUser(){
    firebase.database().ref('Users').child(this.epiUserId).on('value',b=>{
      let c= b.val()
      c['uid']=this.epiUserId
      this.userData.next(c)
      this.epiUser=c
    })
  }

  allow(f:string, sn?:string):boolean{
    switch(f){
      case 'newrig':
        if(this.epiUser.Pos=='SU') return true
        return false
        break;
      case 'addbut':
        if(this.epiUser.Pos=='SU') return true
        return false
        break;
      case 'newcustomer':
        if(this.epiUser.Pos=='SU') return true
        return false
        break;
      case 'contacts':
        if(this.epiUser.Pos=='SU' || this.epiUser.Pos=='admin' || this.epiUser.Pos=='adminS' || this.epiUser.Pos=='sales') return true
        return false
        break;
      case 'machine':
        if(this.epiUser.Pos=='customer' || this.epiUser.Pos=='sales' || this.epiUser.Pos=='SU' || this.epiUser.Pos=='admin' || this.epiUser.Pos=='adminS' || this.epiUser.Pos=='tech') return true
        return false
        break
      case 'technicians':
        if(this.epiUser.Pos=='SU') return true
        return false
        break
      case 'files':
        if(this.epiUser.Pos=='SU' || this.epiUser.Pos=='admin' || this.epiUser.Pos=='adminS' || this.epiUser.Pos=='tech') return true
        return false
        break
      case 'users':
        if(this.epiUser.Pos=='SU') return true
        return false
        break
      case 'auth':
        if(this.epiUser.Pos=='SU' || this.epiUser.Pos=='admin' || this.epiUser.Pos=='adminS') return true
        return false
      case 'report':
        if(this.epiUser.Pos=='SU') return true
        return false
        break
      case 'parts':
        if(this.epiUser.Pos=='SU' || this.epiUser.Pos=='admin' || this.epiUser.Pos=='adminS' || this.epiUser.Pos=='tech') return true
        return false
        break
      case 'visit':
        if(this.epiUser.Pos=='SU' || this.epiUser.Pos=='adminS' || this.epiUser.Pos=='sales') return true
        return false
        break
    }
    
    return false
  }
}

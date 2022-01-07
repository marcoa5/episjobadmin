import { Injectable } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { BehaviorSubject, Subject, Subscription } from 'rxjs';

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
    firebase.auth().onAuthStateChanged(r=>{
      firebase.database().ref('Users').child(r!.uid).on('value',b=>{
        let c= b.val()
        c['uid']=r!.uid
        this.epiUserId=r!.uid
        this.userData.next(c)
        this.epiUser=c
        this.getFleet(this.epiRigs,this.epiAuth,this.epiCateg, this.epiUser)
        this.getCustData()
      })
    })
  }

 

  private rigs:Subject<any>=new BehaviorSubject<any>([])
  private access:Subject<any>=new BehaviorSubject<any>([])
  private categ:Subject<any>=new BehaviorSubject<any>([])
  private fleet:Subject<any>=new BehaviorSubject<any>([])
  private userData:Subject<any>=new BehaviorSubject<any>([])
  private customers:Subject<any>=new BehaviorSubject<any>([])
  private contacts:Subject<any>=new BehaviorSubject<any>([])
  private custI:Subject<any>=new BehaviorSubject<any>(undefined)
  
  get _rigs(){return this.rigs.asObservable()}

  get _access(){return this.access.asObservable()}

  get _categ(){return this.categ.asObservable()}

  get _userData(){return this.userData.asObservable()}

  get _fleet(){return this.fleet.asObservable()}
  
  get _customers(){return this.customers.asObservable()}

  get _contacts(){return this.contacts.asObservable()}

  get _custI(){return this.custI.asObservable()}

  getFleetData(){
    firebase.database().ref('Users').on('value',b=>{
      if(this.epiUser && b.val().id==this.epiUserId){
        let c= b.val()
        c['uid']=this.epiUserId
        this.userData.next(c)
        this.epiUser=c
        this.getFleet(this.epiRigs,this.epiAuth,this.epiCateg, this.epiUser)
      }
    })
    
    firebase.database().ref('MOL').on('value',a=>{
      let b=Object.values(a.val())
      this.rigs.next(b)
      this.epiRigs=b
      this.getFleet(this.epiRigs,this.epiAuth,this.epiCateg, this.epiUser)
    })
    firebase.database().ref('RigAuth').on('value',a=>{
      let b=Object.values(a.val())
      this.access.next(b)
      this.epiAuth=b
      this.getFleet(this.epiRigs,this.epiAuth,this.epiCateg, this.epiUser)
    })
    firebase.database().ref('Categ').on('value',a=>{
      let b=Object.values(a.val())
      this.categ.next(b)
      this.epiCateg=b
      this.getFleet(this.epiRigs,this.epiAuth,this.epiCateg, this.epiUser)
    })
  }

  getCustData(){
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

  getContact(){
    firebase.database().ref('Contacts').on('value',a=>{
      let b:any[]=[]
      a.forEach(c=>{
        c.forEach(d=>{
          let t = d.val()
          t.company=c.key
          b.push(t)
        })
      })
      this.contacts.next(b)
      this.epiContact=b
    })
  }

  getFleet(fRigs:any[], fAuth:any[],fCateg:any[],user:any){
    let a = fRigs.map(r=>{
      let i = fCateg.map(b=>{return b['sn']}).indexOf(r['sn'])
      if(fCateg[i]) r['categ']=fCateg[i]['subCat']
      return r
    }).filter(a=>{
      let iA = fAuth.map(b=>{return b['sn']}).indexOf(a['sn'])
      if(user && (user.Pos=='sales' || user.Pos == 'customer')){
        if(iA>=0 && user.Area && fAuth[iA]['a' + user.Area]=='1') {
          return a
        } else {
          return false
        }
      } else {
      return a
      }
    })
    this.fleet.next(a)
    this.epiFleet=a
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
        if(this.epiUser.Pos=='customer' || this.epiUser.Pos=='sales') return false
        return true
        break
      case 'technicians':
        if(this.epiUser.Pos=='SU') return true
        return false
      case 'files':
        if(this.epiUser.Pos=='SU' || this.epiUser.Pos=='admin' || this.epiUser.Pos=='adminS' || this.epiUser.Pos=='tech') return true
        return false
    }
    return false
  }
}

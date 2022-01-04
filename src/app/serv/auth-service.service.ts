import { Injectable } from '@angular/core';
import { timeStamp } from 'console';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  epiRigs:any[]=[]
  epiAuth:any[]=[]
  epiCateg:any[]=[]
  epiUser:any[]=[]
  constructor() { }
  private rigs:Subject<any>=new BehaviorSubject<any>([])
  private access:Subject<any>=new BehaviorSubject<any>([])
  private categ:Subject<any>=new BehaviorSubject<any>([])
  private fleet:Subject<any>=new BehaviorSubject<any>([])
  private userData:Subject<any>=new BehaviorSubject<any>([])
  
  get _rigs(){
    return this.rigs.asObservable()
  }

  get _access(){
    return this.access.asObservable()
  }

  get _categ(){
    return this.categ.asObservable()
  }

  get _userData(){
    return this.userData.asObservable()
  }

  get _fleet(){return this.fleet.asObservable()}

  getData(){
    firebase.auth().onAuthStateChanged((a:any)=>{
      firebase.database().ref('Users').child(a.uid).on('value',b=>{
        this.userData.next(b.val())
        this.epiUser=b.val()
        this.getFleet(this.epiRigs,this.epiAuth,this.epiCateg, this.epiUser)
      })
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

  getFleet(fRigs:any[], fAuth:any[],fCateg:any[],user:any){
    let a = fRigs.map(r=>{
      let i = fCateg.map(b=>{return b['sn']}).indexOf(r['sn'])
      if(fCateg[i]) r['categ']=fCateg[i]['subCat']
      return r
    }).filter(a=>{
      let iA = fAuth.map(b=>{return b['sn']}).indexOf(a['sn'])
      if(user.Pos=='sales' || user.Pos == 'customer'){
        if(iA>-1 && fAuth[iA]['a' + user.Area]=='1') {
          return a
        } else {
          return false
        }
      } else {
      return a
      }
    })
    this.fleet.next(a)
  }
}

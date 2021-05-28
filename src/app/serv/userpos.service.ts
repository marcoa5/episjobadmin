import { Injectable } from '@angular/core';
import firebase from 'firebase'
import 'firebase/auth'

@Injectable({
  providedIn: 'root'
})
export class UserposService {

  constructor() { }

  getPos(){
    firebase.auth().onAuthStateChanged(a=>{
      if(a) return a?.uid
      return false
    })
  }
}

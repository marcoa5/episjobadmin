import { Injectable } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

@Injectable({
  providedIn: 'root'
})
export class UserposService {

  constructor() { }

  getPos(){
      return firebase.auth().currentUser?.uid
  }
}

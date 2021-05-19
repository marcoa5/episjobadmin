import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { Location } from '@angular/common'

@Injectable({
  providedIn: 'root'
})
export class BackService {

  constructor(public router:Router, public location: Location) { }

  backP(){
    this.location.back()
    return
  }
}

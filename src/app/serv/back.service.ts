import { Injectable } from '@angular/core';
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class BackService {

  constructor(public router:Router) { }

  backP(){
    this.router.navigate(['..'])
    return
  }
}

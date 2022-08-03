import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckwidthService {

  constructor() { }

  isTouch(){
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent)){
      return true
    } else {
      return false
    }
  }
}

import { Component, OnInit, Input } from '@angular/core';
import * as firebase from 'firebase'

@Component({
  selector: 'episjob-sjlist',
  templateUrl: './sjlist.component.html',
  styleUrls: ['./sjlist.component.scss']
})
export class SjlistComponent implements OnInit {
  sj:any[]=[]
  panelOpenState:boolean=false
  constructor() { }
  @Input() sn:string = ''

  @Input() lim:string = ''

  ngOnInit(): void {
    firebase.default.database().ref('Saved/' + this.sn).limitToLast(parseInt(this.lim)).once('value',h=>{
      this.sj=Object.values(h.val())
      console.log(this.sj)
    })
  }

}

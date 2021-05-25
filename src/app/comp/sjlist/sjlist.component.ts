import { Component, OnInit, Input } from '@angular/core';
import * as firebase from 'firebase'
import { Router } from '@angular/router'

@Component({
  selector: 'episjob-sjlist',
  templateUrl: './sjlist.component.html',
  styleUrls: ['./sjlist.component.scss']
})
export class SjlistComponent implements OnInit {
  sj:any[]=[]
  dates:any[]=[]

  panelOpenState:boolean=false
  constructor(private router: Router) { }
  @Input() sn:string = ''
  @Input() lim:string = ''
  @Input() docBpcs:string = ''
  @Input() dataDoc:string = ''
  @Input() customer:string = ''
  @Input() model:string = ''

  ngOnInit(): void {
    firebase.default.database().ref('Saved/' + this.sn).limitToLast(parseInt(this.lim)).once('value',h=>{
      this.dates=Object.keys(h.val())
      this.sj=Object.values(h.val())
    })
  }

  download(a:string){
    firebase.default.storage().ref('Closed/' + a).getDownloadURL()
    .then(a=>{window.open(a)})
  }

}

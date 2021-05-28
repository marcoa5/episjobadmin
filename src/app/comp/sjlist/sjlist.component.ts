import { Component, OnInit, Input } from '@angular/core';
import firebase from 'firebase'
import 'firebase/storage'
import 'firebase/database'
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
    firebase.database().ref('Saved/' + this.sn).limitToLast(parseInt(this.lim)).once('value',h=>{
      this.dates=Object.keys(h.val())
      this.sj=Object.values(h.val())
    })
  }

  download(a:string){
    firebase.storage().ref('Closed/' + a).getDownloadURL()
    .then(a=>{window.open(a)})
  }

}

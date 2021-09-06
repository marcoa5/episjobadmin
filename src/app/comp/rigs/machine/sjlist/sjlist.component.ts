import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { Router } from '@angular/router'
import * as moment from 'moment'

@Component({
  selector: 'episjob-sjlist',
  templateUrl: './sjlist.component.html',
  styleUrls: ['./sjlist.component.scss']
})
export class SjlistComponent implements OnInit {
  sj:any[]=[]
  sjSl:any[]=[]
  inizio: number = 0
  fine: number = 5
  panelOpenState:boolean=false
  constructor(private router: Router) { }
  @Input() list:any[] = []
  @Input() customer:string = ''
  @Input() model:string = ''
  
  ngOnInit(): void {
    
  }

  ngOnChanges(){
    this.main()
  }


  main(){
    this.sjSl = this.list.slice(this.inizio, this.fine)

  }

  download(a:string){
    firebase.storage().ref('Closed/' + a).getDownloadURL()
    .then(a=>{window.open(a)})
  }

  split(e:any){
    this.inizio = e.pageIndex * e.pageSize +1
    this.fine = this.inizio + e.pageSize-1
    this.sjSl = this.list.slice(this.inizio-1,this.fine)
  }

}

import { Component, OnInit, Input, OnChanges } from '@angular/core';
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
  @Input() sn:string = ''
  @Input() start:any|undefined
  @Input() end:any|undefined
  @Input() docBpcs:string = ''
  @Input() customer:string = ''
  @Input() model:string = ''
  
  ngOnInit(): void {

  }

  ngOnChanges(){
    this.main()
  }


  main(){
    firebase.database().ref('Saved/' + this.sn).once('value',h=>{
      let iniz = moment(this.start).format('YYYYMMDD')
      let fine = moment(this.end).format('YYYYMMDD')
      this.sj=[]
      h.forEach(g=>{
        if(g.key && g.key>=iniz && g.key<=fine){
          this.sj.push(g.val())
        }        
      })
    })
    .then(()=>{
      this.sjSl = this.sj.slice(this.inizio, this.fine)
      console.log(this.sjSl)
    })
  }

  download(a:string){
    firebase.storage().ref('Closed/' + a).getDownloadURL()
    .then(a=>{window.open(a)})
  }

  split(e:any){
    this.inizio = e.pageIndex * e.pageSize +1
    this.fine = this.inizio + e.pageSize-1
    this.sjSl = this.sj.slice(this.inizio-1,this.fine)
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { Router } from '@angular/router'
import { MatPaginatorIntl } from '@angular/material/paginator'

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
  constructor(private router: Router, private paginator: MatPaginatorIntl) { }
  @Input() list:any[] = []
  @Input() customer:string = ''
  @Input() model:string = ''
  @Input() sortDA:boolean=true
  
  ngOnInit(): void {
    this.paginator.itemsPerPageLabel = '#'
    console.log(this.list)
  }

  ngOnChanges(){
    this.list.reverse()
    this.main()
  }


  main(){
    this.sjSl = this.list//.slice(this.inizio, this.fine)
  }

  download(a:string){
    firebase.storage().ref('Closed/' + a).getDownloadURL()
    .then(a=>{window.open(a)})
  }

  width(){
    return window.innerWidth>500
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { Router } from '@angular/router'
import { MatPaginatorIntl } from '@angular/material/paginator'
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SjdialogComponent } from './sjdialog/sjdialog.component';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { DeldialogComponent } from 'src/app/comp/util/dialog/deldialog/deldialog.component';
import * as moment from 'moment'
import { ignoreElements } from 'rxjs/operators';

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
  displayedColumns:string[]=['Date', 'Doc#', 'Tech']
  @Input() list:any[] = []
  _list:any[]=[]
  @Input() customer:string = ''
  @Input() model:string = ''
  @Input() sortDA:boolean=true
  subsList:Subscription[]=[]
  pos:string=''
  constructor(private router: Router, private paginator: MatPaginatorIntl, private dialog: MatDialog, private auth:AuthServiceService) { }

  
  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) {
          this.pos=a.Pos
          if(this.pos=='SU') this.displayedColumns=['Date', 'Doc#', 'Tech','del']
        }
      })
    )
  }

  ngOnChanges(){
    this.list.reverse()
    this._list = this.list.slice(this.inizio,this.fine)
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  split(e:any){
    this.inizio = e.pageIndex * e.pageSize
    this.fine = this.inizio + e.pageSize
    this._list = this.list.slice(this.inizio,this.fine)
  }

  open(n:number){
    const dialogSJ= this.dialog.open(SjdialogComponent, {panelClass: 'sj-dialog', data:this._list[n]})
    dialogSJ.afterClosed().subscribe(a=>{
    })
  }

  delete(n:number){
    let a = this._list[n]
    firebase.database().ref('Saved').child(a.matricola.toUpperCase()).child(a.path).once('value',g=>{
      console.log(g.val())
      if(g.val()!=null) {
        const dia = this.dialog.open(DeldialogComponent, {data:{name:'Doc nr', desc:'SJ nr. ' + a.docbpcs + ' - ' + a.data11}})
        dia.afterClosed().subscribe(res=>{
          if(res) {
            firebase.database().ref('Saved').child(a.matricola).child(a.path).remove()
            .then(()=>{
              firebase.database().ref('Balance').child(a.matricola).child(a.path).remove()
            })
          }
        })
      }
    })
  }
}

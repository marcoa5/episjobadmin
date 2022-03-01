import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { Router } from '@angular/router'
import { MatPaginatorIntl } from '@angular/material/paginator'
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SjdialogComponent } from './sjdialog/sjdialog.component';

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
  constructor(private router: Router, private paginator: MatPaginatorIntl, private dialog: MatDialog) { }

  
  ngOnInit(): void {
  }

  ngOnChanges(){
    this.list.reverse()
    this._list = this.list.slice(this.inizio,this.fine)
  }

  split(e:any){
    this.inizio = e.pageIndex * e.pageSize
    this.fine = this.inizio + e.pageSize
    this._list = this.list.slice(this.inizio,this.fine)
  }

  open(n:number){
    const dialogSJ= this.dialog.open(SjdialogComponent, {panelClass: 'sj-dialog', data: this.list[n]})
    dialogSJ.afterClosed().subscribe(a=>{
      console.log(a)
    })
  }
}

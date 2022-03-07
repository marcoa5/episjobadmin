import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SubeddialogComponent } from './subeddialog/subeddialog.component';

@Component({
  selector: 'episjob-subeq',
  templateUrl: './subeq.component.html',
  styleUrls: ['./subeq.component.scss']
})
export class SubeqComponent implements OnInit {
  inizio: number = 0
  fine: number = 5
  panelOpenState:boolean=false
  displayedColumns:string[]=['Item', 'Description', 's/n']
  @Input() list:any[] = []
  _list:any[]=[]
  @Input() pos:string=''
  constructor(private router: Router, private dialog: MatDialog) { }

  
  ngOnInit(): void {
  }

  ngOnChanges(){
    this.list.sort((a:any,b:any)=>{
      if(a.cat>b.cat) return 1
      if(a.cat<b.cat) return -1
      return 0
    })
    this._list = this.list.slice(this.inizio,this.fine)
  }

  split(e:any){
    this.inizio = e.pageIndex * e.pageSize
    this.fine = this.inizio + e.pageSize
    this._list = this.list.slice(this.inizio,this.fine)
  }

  open(a:any){
    this.dialog.open(SubeddialogComponent, {data:a})
  }

}

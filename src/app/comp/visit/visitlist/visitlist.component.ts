import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import * as moment from 'moment'
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { DeldialogComponent } from '../../util/deldialog/deldialog.component';
import { ActivatedRoute } from '@angular/router';
import { VisitdetailsComponent } from '../../util/dialog/visitdetails/visitdetails.component';

@Component({
  selector: 'episjob-visitlist',
  templateUrl: './visitlist.component.html',
  styleUrls: ['./visitlist.component.scss']
})
export class VisitlistComponent implements OnInit {
  @Input() day:string=''
  @Input() pos:string=''
  @Input() userId:string=''
  today:string=moment(new Date()).format('DD/MM/YYYY')
  listV:any|undefined
  constructor(private router: Router, private dialog:MatDialog, private route:ActivatedRoute) { }

  ngOnInit(): void {
    
  }

  ngOnChanges():void{
    this.listV=[]
    this.today=moment(new Date(this.day)).format('DD/MM/YYYY')
    let u = moment(new Date(this.day)).format('YYYYMMDD')
    firebase.database().ref('CustVisit').child(u).once('value',a=>{
      a.forEach(b=>{
        b.forEach(c=>{
          if((b.key?.substring(0,28)==this.userId && this.pos=='sales') || (this.pos=='SU' || this.pos=='adminS')){
            this.listV.push(c.val())
          }
        })
      })
    })
  }

  newV(){
    this.router.navigate(['newvisit', {date: this.day}])
  }

  openVisit(a:any){
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(VisitdetailsComponent, {
      data: a
    });
  }
}
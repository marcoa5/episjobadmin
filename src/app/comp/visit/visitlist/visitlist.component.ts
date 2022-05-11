import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import * as moment from 'moment'
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { DeldialogComponent } from '../../util/dialog/deldialog/deldialog.component';
import { ActivatedRoute } from '@angular/router';
import { VisitdetailsComponent } from '../../util/dialog/visitdetails/visitdetails.component';
import { MatChip } from '@angular/material/chips';
import { AuthServiceService } from 'src/app/serv/auth-service.service';

@Component({
  selector: 'episjob-visitlist',
  templateUrl: './visitlist.component.html',
  styleUrls: ['./visitlist.component.scss']
})
export class VisitlistComponent implements OnInit {
  @Input() day:string=''
  @Input() pos:string=''
  @Input() userId:string=''
  @Output() refresh=new EventEmitter()
  today:string=moment(new Date()).format('DD/MM/YYYY')
  _listV:any|undefined
  listV:any|undefined
  spin:boolean=false
  constructor(private router: Router, private dialog:MatDialog, private route:ActivatedRoute, private auth: AuthServiceService) { }

  ngOnInit(): void {
    
  }

  ngOnChanges():void{
    
    this.day!=''? this.today=moment(new Date(this.day)).format('DD/MM/YYYY') : ''
    let u = moment(new Date(this.day)).format('YYYYMMDD')
    firebase.database().ref('CustVisit').child(u).once('value',a=>{
      this.spin=true
      this._listV=[]
      this.listV=[]
      a.forEach(b=>{
        b.forEach(c=>{
          if((b.key?.substring(0,28)==this.userId && this.auth.acc('Salesman') || this.auth.acc('AdminSalesRights'))){
            let gty = c.val()
            gty['url']= a.key+'/'+b.key+'/'+c.key
            this._listV.push(gty)
          }
        })
      })
    })
    .then(()=>{
      this.listV=this._listV
      this.spin=false
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

    dialogRef.afterClosed().subscribe(result=>{
      if(result=='delete' || result=='upd') {
        this.refresh.emit('ref')
      } else if(result!='' || result!=undefined) {
        this.refresh.emit(result)
      } 
    })
  }

  chPos(a:string){
    return this.auth.acc(a)
  }

}
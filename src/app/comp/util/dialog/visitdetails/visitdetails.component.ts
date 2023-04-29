import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog'
import { DeldialogComponent } from '../deldialog/deldialog.component'
import firebase from 'firebase/app'
import { UpddialogComponent } from '../upddialog/upddialog.component';
import * as moment from 'moment'
import { CheckwidthService } from 'src/app/serv/checkwidth.service';


@Component({
  selector: 'episjob-visitdetails',
  templateUrl: './visitdetails.component.html',
  styleUrls: ['./visitdetails.component.scss']
})
export class VisitdetailsComponent implements OnInit {
  val:any[]=[]
  notes:any=''
  url:string = ''
  newNotes:string=''
  attList:string[]=[]
  day:string=''
  giorno!:Date
  dayNew!:Date
  hide:boolean=true
  constructor(private ch:CheckwidthService, public dialogRef: MatDialogRef<VisitdetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog:MatDialog) { 
    
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth<500) {this.hide=true}else{this.hide=false}
  }

  ngOnInit(): void {
    this.onResize()
    if(this.data.epiAtt) this.attList = this.data.epiAtt.map((a:any)=>{
      return a.name
    })
    this.attList.push(this.data.sam)
    if(this.data.cusAtt.length>0){
      this.data.cusAtt.forEach((a:any)=>{
        this.attList.push(a)
      })
    }
    
    this.val=[
      {lab: 'Customer Name', value: this.data.c1, click:''},
      {lab: 'Place', value: this.data.place, click:''},
      //{lab: 'Date', value: this.data.date, click:''}
    ]
    this.notes= this.data.notes
    this.newNotes=this.notes
    this.url = this.data.url
    this.giorno=this.data.date
    this.day=moment(this.data.date).format('DD/MM/YYYY')
    this.dayNew=this.data.date
  }

  test(e:any){
    this.newNotes=e.target.value
  }

  onNoClick(){
    if(this.notes!=this.newNotes){
      const dialogconf = new MatDialogConfig();
      dialogconf.disableClose=false;
      dialogconf.autoFocus=false;
      const dialogRef = this.dialog.open(UpddialogComponent, {
        data: {cust: 'Notes', desc: 'Visit'}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result=='upd'){
          firebase.database().ref('CustVisit').child(this.data.url).child('notes').set(this.newNotes)
          .then(()=>{
            this.changeDate()
          })
        } else{
          this.changeDate()
        }
      })
    } else {
      this.changeDate()
    }
    
  }
  
  changeDate(){
    if(this.data.date!=this.dayNew){
      let urlSplit=this.url.split('/')
      let urlNew:string=''
      let content:any
      firebase.database().ref('CustVisit').child(this.url).once('value',a=>{
        content = a.val()
      })
      .then(()=>{
        urlSplit[0]=moment(this.dayNew).format('YYYYMMDD')
        urlNew=urlSplit.join('/')
        content['date']=moment(this.dayNew).format('YYYY-MM-DD')
        firebase.database().ref('CustVisit').child(urlNew).set(content)
        .then(()=>{
          firebase.database().ref('CustVisit').child(this.url).remove()
          .then(()=>this.dialogRef.close(moment(this.dayNew).format('YYYY-MM-DD')))
        })
      })
    } else {
      this.dialogRef.close('upd')
    } 
  }

  del(){
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(DeldialogComponent, {
      data: {name: this.url, desc: 'Visit'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined) {
        firebase.database().ref('CustVisit').child(this.url).remove()
        .then(()=>this.dialogRef.close('delete'))
        .catch(err=>this.dialogRef.close())
      }
    });
  }

  chDate(e:any){
    this.dayNew=e.target.value
  }

  chW(){
    return this.ch.isTouch()
  }
}

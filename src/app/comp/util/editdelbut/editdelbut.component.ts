import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Location } from '@angular/common'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { DeldialogComponent } from '../../util/dialog/deldialog/deldialog.component';
import { AddhrsComponent } from '../../util/dialog/addhrs/addhrs.component'
import { NewcontactComponent } from '../../util/dialog/newcontact/newcontact.component';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { auth } from 'firebase-admin';
import { NewsubeqComponent } from '../../rigs/machine/subeq/newsubeq/newsubeq.component';
import { SubeddialogComponent } from '../../rigs/machine/subeq/subeddialog/subeddialog.component';
import { ImportpartsComponent } from '../dialog/importparts/importparts.component';
import * as moment from 'moment';
import { Router } from '@angular/router';
import 'moment-timezone'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'episjob-editdelbut',
  templateUrl: './editdelbut.component.html',
  styleUrls: ['./editdelbut.component.scss']
})
export class EditdelbutComponent implements OnInit {
  pos:string|undefined
  @Input() tech:boolean=false
  @Input() user:boolean=false
  @Input() newConta:boolean=false
  @Input() newBal:boolean=false
  @Input() visitreport:boolean=false
  @Input() editItem:boolean = true
  @Input() deleteItem:boolean=true
  @Input() pricelist:boolean = false
  @Input() cliente:boolean=false
  @Input() contracts:boolean=false
  @Input() machine:boolean=false
  @Input() addHr:boolean=false
  @Input() cont:boolean=false
  @Input() sj:boolean=false
  @Input() func:string|undefined
  @Input() nome:string|undefined
  @Input() seriale:string|undefined
  @Input() id:string|undefined
  @Input() check:boolean=true
  @Input() valore:string=''
  @Input() addP:boolean=false
  @Input() parts:boolean=false
  @Input() rigsAction:boolean=false
  @Input() balance:boolean=false
  @Input() custAction:boolean=false
  @Input() machineShare:boolean=false
  @Input() custShare:boolean=false
  @Input() authActions:boolean=false
  @Output() edit = new EventEmitter()
  @Output() addH = new EventEmitter()
  @Output() newCont = new EventEmitter()
  @Output() sjReport = new EventEmitter()
  @Output() hrsReport = new EventEmitter()
  @Output() addA = new EventEmitter()
  @Output() addParts = new EventEmitter()
  @Output() expParts= new EventEmitter()
  @Output() expCon=new EventEmitter()
  @Output() addCon=new EventEmitter()
  @Output() newPriceL=new EventEmitter()
  @Output() addBal=new EventEmitter()
  @Output() dlVisitRep=new EventEmitter()
  @Output() expDet=new EventEmitter()
  @Output() exp=new EventEmitter()
  @Output() ePot=new EventEmitter()
  @Output() eCus=new EventEmitter()
  @Output() newBalance=new EventEmitter()
  @Output() newCon=new EventEmitter()
  @Output() eCon=new EventEmitter()
  @Output() shareW=new EventEmitter()
  @Output() shareC=new EventEmitter()
  @Output() downloadAuth=new EventEmitter()
  @Output() uploadAuth=new EventEmitter()

  show:boolean=false
  subsList:Subscription[]=[]

  constructor(private router:Router, private location: Location, public dialog: MatDialog, public auth:AuthServiceService) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{this.pos=a.Pos})
    )
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  downloadVisitReport(){
    this.sh()
    this.dlVisitRep.emit('')
  }

  openDialog(): void {
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(DeldialogComponent, {
      data: {sn: this.nome, name: this.nome, custid:this.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined && this.auth.acc('SURights')) {
        firebase.database().ref(this.func).child(result).remove()
        if(this.func=='CustomerC'){
          firebase.database().ref('CustContacts').child(result).remove()
          firebase.database().ref('CustAddress').child(result).remove()
          firebase.database().ref('Updates').child('Custupd').set(moment.tz(new Date(),environment.zone).format('YYYYMMDDHHmmss'))
        }else if(this.func=='MOL') {
          firebase.database().ref('RigAuth').child(result).remove()
          firebase.database().ref('Hours').child(result).remove()
          firebase.database().ref('Categ').child(result).remove()
          firebase.database().ref('SubEquipment').child(result).remove()
          firebase.database().ref('ShipTo').child(result).remove()
          firebase.database().ref('Updates').child('MOLupd').set(moment.tz(new Date(),environment.zone).format('YYYYMMDDHHmmss'))
        }
        this.router.navigate(['rigs'])
      }
    });
  } 

  edita(){
    this.edit.emit('edit')
  }

  contact(){
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(NewcontactComponent, {
      data: {id: this.id, type: 'new'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined) {
        this.newCont.emit(result)
      }
    })
  }

  hrsAdd(){
    this.sh()
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(AddhrsComponent, {
      data: {sn: this.nome}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined) {
        this.addH.emit(result)
      }
    })
  }
  
  report(){
    this.sh()
    this.sjReport.emit('sjReport')
  }

  reportHrs(){
    this.sh()
    this.hrsReport.emit('hrsReport')
  }

  reportSJ(){
    this.sh()
    this.sjReport.emit('hrsReport')
  }

  sh(){
    this.show=!this.show
  }

  addSubEq(){
    const step1 = this.dialog.open(NewsubeqComponent, {data: this.valore})
    step1.afterClosed().subscribe(a=>{
      if(a) {
        const step2 = this.dialog.open(SubeddialogComponent,{data:{cat:a[1],new:true, rigsn:this.valore}})
      }
    })
    this.sh()
  }

  addAdd(){
    this.addA.emit('ok')
    this.sh()
  }

  chPos(a:string){
    return this.auth.acc(a)
  }

  chPosBal(a:string){
    return this.auth.acc(a)
  }

  hrsPartReq(){
    this.sh()
    this.addParts.emit('')
  }

  exportParts(){
    this.sh()
    this.expParts.emit('')
  }

  exportContract(){
    this.sh()
    this.expCon.emit('')
  }

  addContract(){
    this.sh()
    this.addCon.emit('')
  }

  addPriceList(){
    this.sh()
    this.newPriceL.emit('')
  }

  addBalance(){
    this.addBal.emit('blanace')
    this.sh()
  }

  newRig(){
    this.router.navigate(['newrig'])
  }

  newCust(){
    this.router.navigate(['newc'])
  }

  exportDetails(){
    this.sh()
    this.expDet.emit()
  }

  export(){
    this.sh()
    this.exp.emit()
  }

  exportPotential(){
    this.sh()
    this.ePot.emit('ok')
  }

  exportCustomer(){
    this.sh()
    this.eCus.emit('ok')
  }

  newTech(){
    this.router.navigate(['newtech'])
  }

  newBala(){
    this.sh()
    this.newBalance.emit('ok')
  }

  addCont(){
    this.sh()
    this.newCon.emit('ok')
    
  }

  addUser(){
    this.router.navigate(['newuser'])
  }

  exportCont(){
    this.sh()
    this.eCon.emit('ok')
  }

  share(){
    this.sh()
    this.shareW.emit('ok')
  }

  shareCust(){
    this.sh()
    this.shareC.emit()
  }

  dlAuth(){
    this.downloadAuth.emit()
  }

  ulAuth(){
    this.uploadAuth.emit()
  }
}

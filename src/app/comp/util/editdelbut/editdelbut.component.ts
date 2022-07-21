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

@Component({
  selector: 'episjob-editdelbut',
  templateUrl: './editdelbut.component.html',
  styleUrls: ['./editdelbut.component.scss']
})
export class EditdelbutComponent implements OnInit {
  pos:string|undefined
  @Input() cliente:boolean=false
  @Input() machine:boolean=false
  @Input() addHr:boolean=false
  @Input() cont:boolean=false
  @Input() func:string|undefined
  @Input() nome:string|undefined
  @Input() seriale:string|undefined
  @Input() id:string|undefined
  @Input() check:boolean=true
  @Input() valore:string=''
  @Input() addP:boolean=false
  @Input() parts:boolean=false
  @Output() edit = new EventEmitter()
  @Output() addH = new EventEmitter()
  @Output() newCont = new EventEmitter()
  @Output() sjReport = new EventEmitter()
  @Output() hrsReport = new EventEmitter()
  @Output() addA = new EventEmitter()
  @Output() addParts = new EventEmitter()
  @Output() expParts= new EventEmitter()
  show:boolean=false
  subsList:Subscription[]=[]

  constructor(private location: Location, public dialog: MatDialog, public auth:AuthServiceService) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{this.pos=a.Pos})
    )
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
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
        }else if(this.func=='MOL') {
          firebase.database().ref('RigAuth').child(result).remove()
          firebase.database().ref('Hours').child(result).remove()
          firebase.database().ref('Categ').child(result).remove()
          firebase.database().ref('SubEquipment').child(result).remove()
          firebase.database().ref('ShipTo').child(result).remove()
        }
        this.location.back()
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
    this.sjReport.emit('sjReport')
  }

  reportHrs(){
    this.hrsReport.emit('hrsReport')
  }

  reportSJ(){
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
  }

  addAdd(){
    this.addA.emit('ok')
  }

  chPos(a:string){
    return this.auth.acc(a)
  }

  hrsPartReq(){
    this.addParts.emit('')
  }

  exportParts(){
    this.expParts.emit('')
  }
}

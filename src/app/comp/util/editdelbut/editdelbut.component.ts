import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Location } from '@angular/common'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { DeldialogComponent } from '../../util/dialog/deldialog/deldialog.component';
import { AddhrsComponent } from '../../util/dialog/addhrs/addhrs.component'
import { NewcontactComponent } from '../../util/dialog/newcontact/newcontact.component';

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
  @Output() edit = new EventEmitter()
  @Output() addH = new EventEmitter()
  @Output() newCont = new EventEmitter()
  @Output() sjReport = new EventEmitter()
  @Output() hrsReport = new EventEmitter()
  constructor(private location: Location, public dialog: MatDialog) { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(a=>{
      if(a){
        firebase.database().ref('Users/' + a.uid).child('Pos').once('value',b=>{
          this.pos=b.val()
        })
      }
    })
  }

  openDialog(): void {
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(DeldialogComponent, {
      data: {sn: this.nome, name: this.nome, custid:this.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined && this.pos=='SU') {
        firebase.database().ref(this.func + '/' + result).remove()
        if(this.func=='MOL') firebase.database().ref('RigAuth/' + result).remove()
        if(this.func=='MOL') firebase.database().ref('Categ/' + result).remove()
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

}

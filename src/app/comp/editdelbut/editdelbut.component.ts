import { Component, OnInit, Input, Inject } from '@angular/core';
import { Location } from '@angular/common'
import firebase from 'firebase'
import 'firebase/auth'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { DeldialogComponent } from '../dialog/deldialog/deldialog.component';


export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'episjob-editdelbut',
  templateUrl: './editdelbut.component.html',
  styleUrls: ['./editdelbut.component.scss']
})
export class EditdelbutComponent implements OnInit {
  pos:string|undefined
  @Input() func:string|undefined
  @Input() nome:string|undefined
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
      data: {name: this.nome}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined && this.pos=='SU') {
        firebase.database().ref(this.func + '/' + result).remove()
        this.location.back()
      }
    });
  }
}

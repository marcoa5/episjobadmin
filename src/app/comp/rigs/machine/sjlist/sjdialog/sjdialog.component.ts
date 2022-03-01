import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import firebase from 'firebase/app'

@Component({
  selector: 'episjob-sjdialog',
  templateUrl: './sjdialog.component.html',
  styleUrls: ['./sjdialog.component.scss']
})
export class SjdialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SjdialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    
  }

  onNoClick(){
    this.dialogRef.close()
  }

  download(a:string){
    this.dialogRef.close()
    firebase.storage().ref('Closed/' + a).getDownloadURL()
    .then(a=>{window.open(a)})
  }

}

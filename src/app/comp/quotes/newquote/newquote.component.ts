import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-newquote',
  templateUrl: './newquote.component.html',
  styleUrls: ['./newquote.component.scss']
})
export class NewquoteComponent implements OnInit {
  rig:any
  constructor(private dialogRef:MatDialogRef<NewquoteComponent>, @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }

  newRig(e:any){
    this.rig=e
  }
}

import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'episjob-comdatedialog',
  templateUrl: './comdatedialog.component.html',
  styleUrls: ['./comdatedialog.component.scss']
})
export class ComdatedialogComponent implements OnInit {

  date:FormGroup=new FormGroup({
    comDate:new FormControl('')
  })
  constructor(public dialogRef: MatDialogRef<ComdatedialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    
  }
  chOk:boolean=true
  

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ch(e:any){
    if(e.target.value == null) {this.chOk = true} else {this.chOk = false}
  }
}

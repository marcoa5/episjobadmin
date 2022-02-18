import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-spv',
  templateUrl: './spv.component.html',
  styleUrls: ['./spv.component.scss']
})
export class SpvComponent implements OnInit {
  travelE!:FormGroup
  constructor(public dialogRef: MatDialogRef<SpvComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    this.travelE = fb.group({
      km:['']
    })
   }
    
  ngOnInit(): void {
    if(this.data){
      this.travelE.controls.km.setValue(this.data)
    }
  }

  onNoClick(){
    this.dialogRef.close()
  }
  
  sum(a:string){
    let r = parseInt(a)*0.07
    let f = r.toFixed(0) + '.00'
    if(!isNaN(r)) return f
    return null 
  }
}

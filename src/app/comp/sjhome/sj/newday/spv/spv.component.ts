import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-spv',
  templateUrl: './spv.component.html',
  styleUrls: ['./spv.component.scss']
})
export class SpvComponent implements OnInit {
  travelE!:FormGroup
  max:number=0
  constructor(public dialogRef: MatDialogRef<SpvComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    this.travelE = fb.group({
      km:['']
    })
   }
    
  ngOnInit(): void {
    if(this.data.spvkm){
      this.travelE.controls.km.setValue(this.data.spvkm)
    }
    if(this.data.km && this.data.km>0){
      this.max=this.data.km
      this.travelE.controls.km.setValidators(Validators.max(this.data.km))
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

  chMax(e:any){
    if(e.target.value>this.max) this.travelE.controls.km.setValue(this.max)
  }
}

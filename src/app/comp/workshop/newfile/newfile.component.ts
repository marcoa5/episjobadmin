import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
  selector: 'episjob-newfile',
  templateUrl: './newfile.component.html',
  styleUrls: ['./newfile.component.scss']
})
export class NewfileComponent implements OnInit {
  details:any|undefined
  rigData!:FormGroup
  appearance:MatFormFieldAppearance='fill'
  constructor(private dialogRef:MatDialogRef<NewfileComponent>, @Inject(MAT_DIALOG_DATA) public data:any, private fb:FormBuilder) {
    this.rigData=fb.group({
      sn: ['',Validators.required],
      model: ['',Validators.required],
      customer: ['',Validators.required],
      custid: ['',Validators.required],
    })
  }

  ngOnInit(): void {
    console.log(this.data)
  }

  onNoClick(){
    this.dialogRef.close()
  }

  dat(e:any){
    console.log(e)
    this.details=undefined
    if(e!='' && e!=undefined) {
      this.details=e
      this.rigData.controls.sn.setValue(e.sn)
      this.rigData.controls.model.setValue(e.model)
      this.rigData.controls.customer.setValue(e.customer)
      this.rigData.controls.custid.setValue(e.custid)
    }
  }

}

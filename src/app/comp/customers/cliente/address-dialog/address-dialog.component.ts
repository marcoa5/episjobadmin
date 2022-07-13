import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-address-dialog',
  templateUrl: './address-dialog.component.html',
  styleUrls: ['./address-dialog.component.scss']
})
export class AddressDialogComponent implements OnInit {
  add!:FormGroup
  constructor(private fb: FormBuilder, private dilogRef: MatDialogRef<AddressDialogComponent>, @Inject(MAT_DIALOG_DATA) public data:any) { 
    this.add=this.fb.group({
      address: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.add.controls.address.setValue(this.data.value)
  }

  onNoClick(){
    this.dilogRef.close()
  }

  check(){
    if(this.add.controls.address.value==this.data.value) return true
    return false
  }

}

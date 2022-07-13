import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeldialogComponent } from 'src/app/comp/util/dialog/deldialog/deldialog.component';

@Component({
  selector: 'episjob-address-dialog',
  templateUrl: './address-dialog.component.html',
  styleUrls: ['./address-dialog.component.scss']
})
export class AddressDialogComponent implements OnInit {
  add!:FormGroup
  constructor(private dialog: MatDialog , private fb: FormBuilder, private dialogRef: MatDialogRef<AddressDialogComponent>, @Inject(MAT_DIALOG_DATA) public data:any) { 
    this.add=this.fb.group({
      address: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.add.controls.address.setValue(this.data.value)
  }

  onNoClick(){
    this.dialogRef.close()
  }

  check(){
    if(this.add.controls.address.value==this.data.value) return true
    return false
  }

  delete(a:string){
    const dia = this.dialog.open(DeldialogComponent, {data:{desc:'Address "'+ a + '"',id:'ok'}})
    dia.afterClosed().subscribe(res=>{
      console.log(res)
      if(res) this.dialogRef.close('delete')
    })
  }

}

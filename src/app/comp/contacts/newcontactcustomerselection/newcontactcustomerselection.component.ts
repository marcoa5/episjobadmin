import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-newcontactcustomerselection',
  templateUrl: './newcontactcustomerselection.component.html',
  styleUrls: ['./newcontactcustomerselection.component.scss']
})
export class NewcontactcustomerselectionComponent implements OnInit {
  customer:any
  constructor(private dialogRef:MatDialogRef<NewcontactcustomerselectionComponent>, @Inject(MAT_DIALOG_DATA) public data:any ) { }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }

  newId(e:any){
    this.customer=e
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'episjob-visitdetails',
  templateUrl: './visitdetails.component.html',
  styleUrls: ['./visitdetails.component.scss']
})
export class VisitdetailsComponent implements OnInit {
  val:any[]=[]
  constructor(public dialogRef: MatDialogRef<VisitdetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
    
  }

  ngOnInit(): void {
    this.val=[
      {lab: 'Customer Name', value: this.data.c1, click:''},
      {lab: 'Contact', value: this.data.name, click:''},
      {lab: 'Place', value: this.data.place, click:''},
      {lab: 'Notes', value: this.data.notes, click:''},

    ]
  }

  onNoClick(){
    this.dialogRef.close();
  }

}

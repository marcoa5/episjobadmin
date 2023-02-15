import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-change-detail',
  templateUrl: './change-detail.component.html',
  styleUrls: ['./change-detail.component.scss']
})
export class ChangeDetailComponent implements OnInit {

  constructor(private dialogRef:MatDialogRef<ChangeDetailComponent>,@Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit(): void {
  }

}

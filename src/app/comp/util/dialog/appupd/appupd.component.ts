import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SwupdateService } from 'src/app/serv/swupdate.service';

@Component({
  selector: 'episjob-appupd',
  templateUrl: './appupd.component.html',
  styleUrls: ['./appupd.component.scss']
})
export class AppupdComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AppupdComponent>, @Inject(MAT_DIALOG_DATA) public data: any ,private swu: SwupdateService) { }

  ngOnInit(): void {
  }

  upd(){
    this.swu.doAppUpdate()
  }
}

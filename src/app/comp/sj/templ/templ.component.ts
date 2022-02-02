import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-templ',
  templateUrl: './templ.component.html',
  styleUrls: ['./templ.component.scss']
})
export class TemplComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TemplComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'episjob-consuntivo',
  templateUrl: './consuntivo.component.html',
  styleUrls: ['./consuntivo.component.scss']
})
export class ConsuntivoComponent implements OnInit {

  constructor(private dialogRef:MatDialogRef<ConsuntivoComponent,any>) { }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }

  send(){
    this.dialogRef.close('go')
  }
}

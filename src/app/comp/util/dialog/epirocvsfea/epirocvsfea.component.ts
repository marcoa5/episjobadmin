import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'episjob-epirocvsfea',
  templateUrl: './epirocvsfea.component.html',
  styleUrls: ['./epirocvsfea.component.scss']
})
export class EpirocvsfeaComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EpirocvsfeaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  Epiroc(){
    this.dialogRef.close('epiroc')
  }

  FEA(){
    this.dialogRef.close('fea')
  }

  onNoClick(){
    this.dialogRef.close()
  }


}

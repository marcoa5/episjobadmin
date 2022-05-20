import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Clipboard } from '@angular/cdk/clipboard'
import { GetworkshopreportService } from 'src/app/serv/getworkshopreport.service';

@Component({
  selector: 'episjob-filedialog',
  templateUrl: './filedialog.component.html',
  styleUrls: ['./filedialog.component.scss']
})
export class FiledialogComponent implements OnInit {
  labels:any[]=[]
  info!:FormGroup
  fileName=new FormControl(this.data.file)
  sn=new FormControl(this.data.sn)
  model=new FormControl(this.data.model)
  customer=new FormControl(this.data.customer)
  hrs=new FormControl(this.data.hrs)
  sj=new FormControl(this.data.sj)
  fileNr=new FormControl(this.data.fileNr)
  ws=new FormControl(this.data.ws)
  status=new FormControl(this.data.status)
  constructor(private dialogRef:MatDialogRef<FiledialogComponent>, @Inject(MAT_DIALOG_DATA) public data:any, private clip:Clipboard, private dialog:MatDialog, private exp:GetworkshopreportService) { }

  ngOnInit(): void {
   
  }

  onNoClick(){
    this.dialogRef.close()
  }

  download(gt:any){
    this.exp.report(gt)
  }

}

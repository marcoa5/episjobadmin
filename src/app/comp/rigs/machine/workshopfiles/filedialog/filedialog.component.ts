import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { Clipboard } from '@angular/cdk/clipboard'
import { CopyComponent } from 'src/app/comp/util/dialog/copy/copy.component';

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
  appearance:MatFormFieldAppearance='fill'
  constructor(private dialogRef:MatDialogRef<FiledialogComponent>, @Inject(MAT_DIALOG_DATA) public data:any, private clip:Clipboard, private dialog:MatDialog) { }

  ngOnInit(): void {
   
  }

  onNoClick(){
    this.dialogRef.close()
  }

  download(){
    let exp:string=`File:\t${this.data.file}\nModel:\t${this.data.model}\nCustomer:\t${this.data.customer}\nSJ nr.:\t${this.data.sj?this.data.sj:''}\nFile nr.:\t${this.data.fileNr?this.data.fileNr:''}\n\nDATA\tV1\tV2\tV8\n`
    if(this.data.days){
      let f:any[] = Object.keys(this.data.days)
      f.forEach(a=>{
        exp+=`${a}\t`
        let temp:any=Object.values(this.data.days)[f.indexOf(a)]
        exp+=`${temp.v1?temp.v1:'0'}\t${temp.v2?temp.v2:'0'}\t${temp.v8?temp.v8:'0'}\n`
      })
      this.clip.copy(exp)
      const d = this.dialog.open(CopyComponent)
    }
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GetquarterService } from 'src/app/serv/getquarter.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { validateBasis } from '@angular/flex-layout';

interface el{
  pn: string
  desc: string
  llp: string
}

@Component({
  selector: 'episjob-newpricelist',
  templateUrl: './newpricelist.component.html',
  styleUrls: ['./newpricelist.component.scss']
})
export class NewpricelistComponent implements OnInit {
  info!: FormGroup
  fileName:string=''
  temp: any= {}
  show:boolean=false
  constructor(public dialogRef: MatDialogRef<NewpricelistComponent>, @Inject(MAT_DIALOG_DATA) public data:any, private fb: FormBuilder, private quarter: GetquarterService) {
    this.info = this.fb.group({
      half:[quarter.getQ(new Date()),Validators.required],
      list: ['',Validators.required]
    })
  }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }

  fileUpload(e:any){
    
    let file= e.target.files[0]
    this.fileName = file.name
    let fr = new FileReader()
    fr.onloadend = (i)=>{
      this.buildTable(fr.result!.toString())
    }

    fr.readAsText(file)
    
  }

  buildTable(text:string){
    this.show=false
    this.info.controls.list.setValue(text.replace(/;/g,'\t'))
    let rows = text.split('\r\n')
    let leng:number = rows.length
    let index:number = 0
    rows.forEach(r=>{
      let item = r.split(';')
      let i:el = {
        pn: item[0],
        desc: item[1],
        llp: item[2]
      }
      this.temp[item[0].replace(/[.]/g,"")] = i
      index++
      if(index==leng) {
        this.show=true
      }
    })
    
  }

  ret():any{
    let rs:any = {
      period: this.info.controls.half.value,
      list: this.temp
    }
    this.dialogRef.close(rs)
  }

}

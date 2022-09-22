import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'episjob-selectdialog',
  templateUrl: './selectdialog.component.html',
  styleUrls: ['./selectdialog.component.scss']
})
export class SelectdialogComponent implements OnInit {
  _data:any
  selected:number=0
  constructor(public dialogRef:MatDialogRef<SelectdialogComponent>, @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit(): void {
    this._data=this.data.slice()
    this.data.forEach((a:any)=>{
      if(a.sel==true) this.selected++
    })
  }

  search(e:any){
    console.log(e.target.value)
    if(e.target.value!=""){
      this._data=this.data.filter((a:any)=>{
        return a.name.toLowerCase().includes(e.target.value.toLowerCase())
      })
    } else{
      this._data=this.data.slice()
    }
  }

  select(a:string){
    this.data.forEach((b:any)=>{
      if(b.name==a){
        if(b.sel==true){
          b.sel=false
          this.selected--
        }else{
          b.sel=true
          this.selected++
        }
      }
    })
  }

  onNoClick(){
    this.dialogRef.close()
  }

  download(){
    let exp:any[] = this.data.filter((a:any)=>{
      return a.sel==true
    })
    this.dialogRef.close(exp)
  }

  clear(){
    this.data.forEach((a:any)=>{
      a.sel=false
    })
  }

}

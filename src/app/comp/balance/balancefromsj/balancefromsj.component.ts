import { GeneratedFile } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import firebase from 'firebase/app'
import { FormGroup, FormBuilder } from '@angular/forms'
@Component({
  selector: 'episjob-balancefromsj',
  templateUrl: './balancefromsj.component.html',
  styleUrls: ['./balancefromsj.component.scss']
})
export class BalancefromsjComponent implements OnInit {
  _list:any[]=[]
  list:any[]=[]
  spin:boolean=false
  sel:any=undefined
  form!:FormGroup
  constructor(private dialog:MatDialog, private dialogRef:MatDialogRef<BalancefromsjComponent>, @Inject(MAT_DIALOG_DATA) public data:any, private fb: FormBuilder) {
    this.form = this.fb.group({
      'search' : ['']
    })
  }

  ngOnInit(): void {
    this._list=[]
    this.list=[]
    this.spin=true
    firebase.database().ref('Saved').once('value',a=>{
      if(a.val()!=null) {
        a.forEach(b=>{
          if(b.val()!=null){
            b.forEach(c=>{
              if(c.val()!=null)
              this._list.push({doc:c.val().docbpcs, sn:c.val().matricola,customer:c.val().cliente11, path:c.key,sel:0})
              this._list.reverse()
            })
          }
        })
      }
    })
    .then(()=>{
      let filter:string=this.form.controls.search.value
      this.list=this._list.filter(l=>{
        if(l.doc.toLowerCase().includes(filter.toLowerCase()) ||l.sn.toLowerCase().includes(filter.toLowerCase()) || l.customer.toLowerCase().includes(filter.toLowerCase())){
          return l
        }
        return null
      }) 
      this.spin=false
    })
  }
  select(sn: string, path:string){
    let filter:string = this.form.controls.search.value
    let index:number = this._list.map(l=>{return l.path}).indexOf(path)
    if(this._list[index].sel==0){
      this._list.forEach(l=>{
        l.sel=0
      })
      this._list[index].sel=1
      this.sel=true
      this.list=this._list.filter(l=>{
        if(l.doc.toLowerCase().includes(filter.toLowerCase()) ||l.sn.toLowerCase().includes(filter.toLowerCase()) || l.customer.toLowerCase().includes(filter.toLowerCase())){
          return l
        }
        return null
      })
    } else {
      this._list[index].sel=0
      this.sel=false
      this.list=this._list.filter(l=>{
        if(l.doc.toLowerCase().includes(filter.toLowerCase()) ||l.sn.toLowerCase().includes(filter.toLowerCase()) || l.customer.toLowerCase().includes(filter.toLowerCase())){
          return l
        }
        return null
      })
    }
  }

  onNoClick(){
  this.dialogRef.close()
  
  }

  newId(e:any){
    if(e && e!=''){
      this.sel=e
    } else {
      this.sel = undefined
    }
  }

  selected(){
    this.dialogRef.close(this.sel)
  }
}

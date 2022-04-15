import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChip } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { MakeidService } from 'src/app/serv/makeid.service';
import { AlertComponent } from '../../util/dialog/alert/alert.component';
import firebase from 'firebase/app';
import { ContractalreadyexistsdialogComponent } from '../contractalreadyexistsdialog/contractalreadyexistsdialog.component';

@Component({
  selector: 'episjob-newcontract',
  templateUrl: './newcontract.component.html',
  styleUrls: ['./newcontract.component.scss']
})
export class NewcontractComponent implements OnInit {
  inputData!:FormGroup
  appearance:MatFormFieldAppearance='fill'
  _rigs:any[]=[]
  rigs:any[]=[]
  chStr:boolean=true
  details:any[]=[]
  fileList:any[]=[]
  nameList:any[]=[]
  types:any[]=[
    {value: 'certiq', text:'Certiq'},
    {value: 'rocecop', text:'ROC & COP Care'},
    {value: 'careeco', text:'Care Economy'},
    {value: 'carestd', text:'Care Standard'},
    {value: 'minecare', text:'MINE Care'},
    {value: 'rigcare', text:'RIG Care'},
    {value: 'frame', text:'Frame Agreement'},
    {value: 'baas', text:'BaaS'},
    {value: 'sac', text:'SaC'},
  ]
  subsList:Subscription[]=[]

  constructor(public dialogRef:MatDialogRef<NewcontractComponent>, @Inject(MAT_DIALOG_DATA) public data:any, private fb: FormBuilder, private auth:AuthServiceService, private makeid:MakeidService, private dialog:MatDialog) {
    this.inputData=fb.group({
      id:['', Validators.required],
      sn:[''],
      model:['', Validators.required],
      customer:['', Validators.required],
      custCode:['', Validators.required],
      type:['', Validators.required],
      start:['', Validators.required],
      end:['', Validators.required]
    })
  }

  ngOnInit(): void {
    let r = this.inputData.controls
    //r.model.disable()
    //r.customer.disable()
    if(this.data.new) this.inputData.controls.id.setValue(this.makeid.makeId(7))
    this.subsList.push(
      this.auth._rigs.subscribe(a=>{
        if(a) {
          this._rigs=a
          this.rigs=this._rigs
        }
      })
    )
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  onNoClick(){
    this.dialogRef.close()
  }

  filter(){
    let f=this.inputData.controls.sn.value
    this.details=[]
    if(f.length>0){
      this.chStr=true
      this.rigs=this._rigs.filter(a=>{
        if(a.sn.toLowerCase().includes(f.toLowerCase()) || a.model.toLowerCase().includes(f.toLowerCase()) || a.customer.toLowerCase().includes(f.toLowerCase())) return true
        return false
      }) 
    } else {
      this.rigs= this._rigs
    }
  }

  sel(a:any){
    this.chStr=false
    this.details=[
      {value: a.sn, lab: 'Serial nr.', click:'', url:''},
      {value: a.model, lab: 'Model', click:'', url:''},
      {value: a.customer, lab: 'Customer', click:'', url:''},
    ]
    this.inputData.controls.sn.setValue(a.sn)
    this.inputData.controls.model.setValue(a.model)
    this.inputData.controls.customer.setValue(a.customer)
    this.inputData.controls.custCode.setValue(a.custid)
  }

  reset(){
    this.details=[]
    this.chStr=true
    this.inputData.reset()
    this.fileList=[]
    this.nameList=[]
  }

  fileUpload(e:any){
    let tempList= e.target.files
    for(let i=0; i<tempList.length;i++){
      if(!this.fileList.map(a=>{return a.name}).includes(tempList[i].name)) {
        this.fileList.push(tempList[i])
        this.nameList.push(tempList[i].name)
      }else {
        const msg = this.dialog.open(AlertComponent, {data: 'File "' + tempList[i].name + '"'})
      }
    }
  }
  
  removeFile(a:MatChip){
    console.log(a)
  }

  save(){
    firebase.database().ref('Contracts').child(this.inputData.controls.sn.value).child(this.inputData.controls.type.value).once('value',a=>{
      if(a.val()!=null) {
        const diy = this.dialog.open(ContractalreadyexistsdialogComponent, {data:{sn: this.inputData.controls.sn.value, type:this.inputData.controls.type.value}})
        diy.afterClosed().subscribe(ref=>{
          if(ref!=undefined){
            this.dialogRef.close(this.inputData.value)
          }
        })
      } else {
        this.dialogRef.close(this.inputData.value)
      }
    })
  }
}

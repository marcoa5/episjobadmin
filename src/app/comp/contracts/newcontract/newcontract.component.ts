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
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'episjob-newcontract',
  templateUrl: './newcontract.component.html',
  styleUrls: ['./newcontract.component.scss']
})
export class NewcontractComponent implements OnInit {
  fees:any[]=[]
  discounts:any[]=[]
  inputData!:FormGroup
  appearance:MatFormFieldAppearance='fill'
  _rigs:any[]=[]
  rigs:any[]=[]
  chStr:boolean=true
  details:any[]=[]
  fileList:any[]=[]
  nameList:any[]=[]
  feesMod:boolean=false
  discMod:boolean=false
  types:any[]=[
    {value: 'certiq', text:'Certiq'},
    {value: 'rocecop', text:'ROC & COP Care (con olii)'},
    {value: 'rocecoplub', text:'ROC & COP Care (senza olii)'},
    {value: 'careeco', text:'Care Economy (con olii)'},
    {value: 'careecolub', text:'Care Economy (senza olii)'},
    {value: 'carestd', text:'Care Standard (con olii)'},
    {value: 'carestdlub', text:'Care Standard (senza olii)'},
    {value: 'minecare', text:'MINE Care'},
    {value: 'rigcare', text:'RIG Care'},
    {value: 'frame', text:'Frame Agreement'},
    {value: 'baas', text:'BaaS'},
    {value: 'sac', text:'SaC'},
    {value: 'only', text:'Only Fees'},
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
    if(this.data.info) {
      this.discounts=this.data.info.discounts
      this.fees=this.data.info.fees
      let a = this.data.info
      let g=this.inputData.controls
      g.id.setValue(a.id)
      this.chStr=false
      this.details=['1']
      //g.sn.disable()
      //g.model.disable()
      //g.customer.disable()
      g.sn.setValue(a.sn)
      g.model.setValue(a.model)
      g.customer.setValue(a.customer)
      g.custCode.setValue(a.custCode)
      g.type.setValue(a.type)
      g.start.setValue(new Date(a.start))
      g.end.setValue(new Date(a.end))
    }
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  onNoClick(){
    this.dialogRef.close()
  }

  sel(a:any){
    if(a) {
      if(a.custid && a.custid!='') a.custCode = a.custid
      this.chStr=false
      this.details=[
        {value: a.sn, lab: 'Serial nr.', click:'', url:''},
        {value: a.model, lab: 'Model', click:'', url:''},
        {value: a.customer, lab: 'Customer', click:'', url:''},
      ]
      this.inputData.controls.sn.setValue(a.sn)
      this.inputData.controls.model.setValue(a.model)
      this.inputData.controls.customer.setValue(a.customer)
      this.inputData.controls.custCode.setValue(a.custCode)
    } else {
      this.details=[]
    }
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
    let f:FormGroup=this.inputData
    let g=f.controls
    let v=f.value
    let i:any=this.data.info
    if(this.fees) v.fees=this.fees
    if(this.discounts) v.discounts=this.discounts
    v.start = moment(v.start).format('YYYY-MM-DD')
    v.end = moment(v.end).format('YYYY-MM-DD')
    if(!i || this.discMod || this.feesMod || (i && (g.sn.value!=i.sn || g.model.value!=i.model || g.customer.value!=i.customer||moment(g.end.value).format('YYYY-MM-DD')!=i.end||moment(g.start.value).format('YYYY-MM-DD')!=i.start||g.type.value!=i.type))){
      firebase.database().ref('Contracts').child(this.inputData.controls.sn.value).child(this.inputData.controls.type.value).once('value',a=>{
        if(a.val()!=null) {
          const diy = this.dialog.open(ContractalreadyexistsdialogComponent, {data:{sn: this.inputData.controls.sn.value, type:this.inputData.controls.type.value}})
          diy.afterClosed().subscribe(ref=>{
            if(ref!=undefined){
              firebase.database().ref('Contracts').child(v.sn).child(v.type).child(v.id).set(v)
              .then(()=>{
                this.dialogRef.close(v)
              })
            } else{
              this.dialogRef.close()
            }
          })
        } else {
          firebase.database().ref('Contracts').child(v.sn).child(v.type).child(v.id).set(v)
          .then(()=>{
            this.dialogRef.close(v)
          })
        }
      })
    } else {
      this.dialogRef.close()
    }
    
  }

  getFees(e:any){
    this.fees=e
  }

  getDiscount(e:any){
    this.discounts=e
  }

  chMod(e:any){
    this.feesMod=e
  }

  chModDisc(e:any){
    this.discMod=e
  }
}

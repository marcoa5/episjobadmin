import { Component, OnInit } from '@angular/core';
import { AbstractControl, Form, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder } from '@angular/forms'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { UpddialogComponent } from '../../util/dialog/upddialog/upddialog.component'
import { NotifService } from '../../../serv/notif.service'
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { Subscription } from 'rxjs';
import { MatChip } from '@angular/material/chips';
import { NewcontactComponent } from '../../util/dialog/newcontact/newcontact.component';
import { NewaddressComponent } from '../../util/dialog/newaddress/newaddress.component';
import { MakeidService } from 'src/app/serv/makeid.service';
import * as moment from 'moment';
import 'moment-timezone'
import { environment } from 'src/environments/environment';
import { Observable, fromEvent} from 'rxjs'
import { Location } from '@angular/common'
import { ConfirmComponent } from '../../util/dialog/confirm/confirm.component';
import { NewdataComponent } from '../../util/dialog/newdata/newdata.component';

@Component({
  selector: 'episjob-newrig',
  templateUrl: './newrig.component.html',
  styleUrls: ['./newrig.component.scss']
})
export class NewrigComponent implements OnInit {
  child:number=0
  childAdd:any=[]
  serial:string=''
  rigCat:any[]=[]
  rou:any[]=[]
  rigs: any[]=[]
  rig: string[]=[]
  newR:FormGroup;
  shipTo:FormGroup;
  addUpd:boolean = true
  segment:boolean = true
  customers:any[]=[]
  pos:string=''
  uId:string=''
  uName:string=''
  allow:boolean=false 
  custCon:any[]=[]
  custId:string=''
  conList:any={}
  spin:boolean=true
  addr:any[]=[]
  addV:any
  cId:string=''
  oldRigData:any
  oldShipToData:any
  oldCategData:any
  newCategData:any
  changes:any={}
  when:Date = new Date()
  readonly:boolean=false
  disableChanges:boolean=true
  subsList:Subscription[]=[]

  constructor(private location: Location, private auth: AuthServiceService, public notif: NotifService, private fb:FormBuilder, private makeId: MakeidService, private route:ActivatedRoute, private dialog: MatDialog, private router:Router) { 
    this.newR = fb.group({
      sn:['', [Validators.required]],
      model:['', [Validators.required]],
      site:[''],
      customer:['',[Validators.required]],
      in: ['']
    })
    this.shipTo=fb.group({
      name: '',
      address: [''],
      email:'',
      cig:'',
      cup:''
    })
  }

  track(){
    this.checkChanges().then(val=>{if(val) {this.disableChanges=false}else{this.disableChanges=true}})
  }

  ngOnInit(): void {
    this.subsList.push(fromEvent(window,'click').subscribe(()=>{this.track()}))
    this.subsList.push(fromEvent(document,'keyup').subscribe(()=>{this.track()}))
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.uId=a.uid
        this.uName= a.Nome + ' ' + a.Cognome
        this.pos=a.Pos
        setTimeout(() => {
          this.allow=this.auth.allow('SU',this.pos)
        }, 1);
      }),
      this.auth._fleet.subscribe(a=>{}),
      this.auth._customers.subscribe(a=>{})
    )
    this.subsList.push(this.auth._customers.subscribe(a=>this.customers=a))
    this.subsList.push(this.auth._fleet.subscribe(a=>{this.rigs=a}))
    this.allow=this.auth.allow('SU',this.pos)
    this.route.params.subscribe(a=>{
      this.serial= a.name
      if(this.serial!=undefined) {
        this.rou=['machine',{sn: this.serial}]
        let i = this.rigs.map(a=>{return a.sn}).indexOf(this.serial)
        this.rig=this.rigs[i]
        this.custId=this.rigs[i].custid
        this.addUpd=false
        this.newR = this.fb.group({
          sn:[this.rigs[i].sn,  [Validators.required]],
          model:[this.rigs[i].model, [Validators.required]],
          site:[this.rigs[i].site],
          customer:[this.rigs[i].custid,[Validators.required]],
          in: [this.rigs[i].in]
        })
        this.oldRigData=this.newR.value
        this.getCustInfo()
        .then(()=>{
          firebase.database().ref('shipTo').child(this.serial).once('value',a=>{
            if(a && a.val() && a.val().cont) {
              Object.keys(a.val().cont).forEach((e:any) => {
                this.conList[e]=a.val().cont[e]
              })
              this.shipTo=this.fb.group({
                address: [a.val().address],
                cig: a.val().cig?a.val().cig:'',
                cup: a.val().cup?a.val().cup:'',
              })
              if(!this.addr.includes(a.val().address)){
                let b:string = this.makeId.makeId(8)
                firebase.database().ref('CustAddress').child(this.custId).child(b).set({
                  add: a.val().address
                })
              }
              this.oldShipToData= this.shipTo.value
              let temp:string[]=[]
              Object.values(this.conList).forEach((c:any)=>{temp.push(c.name + (c.surname?(' '+c.surname):''))})
              this.oldShipToData.conList = temp
            }
          }) 
        })
        //this.newR.controls['sn'].disable()
        this.readonly=true
        firebase.database().ref('Categ').child(this.serial).once('value',g=>{
          this.rigCat=[g.val()]
          if(this.rigCat.length>0) this.child=1
          this.oldCategData=this.rigCat[0]
          delete this.oldCategData.sn
        })
      } else {
        this.rou=['rigs']
        this.spin=false
      }
    })
    setTimeout(() => {
      this.checkCon()
    }, 1000);
  }

  chSel(c:MatChip, e:any){
    if(Object.keys(this.conList).includes(e.contId)) return true
    return false
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  datiC(a:FormGroup){
    let g = [(a.get('sn')?.invalid)?'':a.get('sn')?.value,a.get('model')?.value, a.get('customer')?.value]
    g.push(this.child)
    return g
  }

  chDiff(oldData:any,newData:any){
    return new Promise((res,rej)=>{
      console.log(oldData,newData)
      //if(oldData){
        try{
          let o = Object.values(oldData).sort()
          let n:any = Object.values(newData).sort()
          let ok = Object.keys(oldData).sort()
          let nk = Object.keys(newData).sort()
          let len:number = o.length
          let index:number=0
          o.forEach((d:any,i:number)=>{
            if(!Array.isArray(d)){
              if(d!=n[i]) {
                this.changes[Object.keys(oldData)[i]]={old: d,new:n[i]}
              } else {
                delete this.changes[Object.keys(oldData)[i]]
              }
            } else {
              if(d.sort().toString()!=n[i].sort().toString()){
                this.changes[Object.keys(oldData)[i]]={old: d,new:n[i]}
              } else {
                delete this.changes[Object.keys(oldData)[i]]
              }
            }
            index++
            if(index==len) {res('')}
          })
        } catch{res('')}
      //} else {res('')}  
    })
    
    //return same
  }

  checkChanges(){
    let dateLong:string=moment.tz(this.when,environment.zone).format('YYYY-MM-DD - HH:mm:ss')
    return new Promise((res,rej)=>{
      let newShipTo=this.shipTo.value
      let temp:string[]=[]
      Object.values(this.conList).forEach((c:any)=>{temp.push(c.name + (c.surname?(' ' + c.surname):''))})
      newShipTo.conList = temp
      if(this.oldCategData || this.oldRigData || this.oldShipToData){
        Promise.all([this.chDiff(this.oldRigData,this.newR.value),this.chDiff(this.oldShipToData,newShipTo),this.chDiff(this.oldCategData,this.newCategData)])
        .then(()=>{
          let temp:any={}
          if(Object.keys(this.changes).length>0) {
            res(this.changes)
          } else {
            try{delete temp[this.newR.controls.sn.value][dateLong]}catch{}
            res(undefined)
          }
        })
      } else {
        res({newMachine:true})
      }
    })
  }

  add(a:any,b:FormGroup, c:FormGroup){
    
    let g:string[] = [
      b.get('sn')?.value,
      b.get('model')?.value,
      b.get('site')?.value, 
      this.custId, 
      b.get('in')?.value]
    Object.values(this.customers).map(f=>{
      if(f.id==g[3]) g[5]=(f.c1)
    })
    if(a=='addr' && this.allow){
      this.checkChanges().then(ap=>{
        let temp:any={}
        let dateLong:string=moment.tz(this.when,environment.zone).format('YYYY-MM-DD - HH:mm:ss')
        temp = ap
        temp.author = this.uName
        temp.timeStamp = moment.tz(this.when,environment.zone).format('YYYYMMDDHHmmss')
        console.log(temp)
        firebase.database().ref('FleetChanges').child(this.newR.controls.sn.value).child(dateLong).set(temp)
      })
      firebase.database().ref('MOL').child(g[0].toUpperCase()).set({
        custid: g[3],
        customer: g[5].toUpperCase(),
        in: g[4].toUpperCase()? g[4].toUpperCase(): '',
        model: g[1],
        site: g[2].toUpperCase(),
        sn: g[0].toUpperCase(),
      }).then(()=>{
        firebase.database().ref('shipTo').child(g[0].toUpperCase()).set({
          cont: this.conList,
          address: c.controls.address.value,
          cig: c.controls.cig.value,
          cup: c.controls.cup.value
        })
      })
      firebase.database().ref('RigAuth').child(g[0].toUpperCase()).set({
        a1:'0',a2:'0',a3:'0',a4:'0',a5:'0',sn:g[0].toUpperCase()
      })
      this.childAdd['sn']=g[0].toUpperCase()
      firebase.database().ref('Categ').child(g[0].toUpperCase()).set(this.childAdd)
      firebase.database().ref('Updates').child('MOLupd').set(moment.tz(new Date(),environment.zone).format('YYYYMMDDHHmmss'))
      this.router.navigate(['machine', {sn: g[0].toUpperCase()}])
      this.sendNot(g[0].toUpperCase(),g[1],g[5].toUpperCase())
    }
    if(a=='updr' && this.allow){
      const dialogconf = new MatDialogConfig();
      dialogconf.disableClose=false;
      dialogconf.autoFocus=false;
      const dialogRef = this.dialog.open(UpddialogComponent, {
        data: {sn: this.serial, title:'Update'}
      });
      // ADD check per modifica matricola
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.checkChanges().then(ap=>{
            let temp:any={}
            let dateLong:string=moment.tz(this.when,environment.zone).format('YYYY-MM-DD - HH:mm:ss')
            temp = ap
            temp.author = this.uName
            temp.timeStamp = moment.tz(this.when,environment.zone).format('YYYYMMDDHHmmss')
            console.log(temp)
            firebase.database().ref('FleetChanges').child(this.newR.controls.sn.value).child(dateLong).set(temp)
          })
          firebase.database().ref('MOL').child(this.serial).set({
            customer: g[5].toUpperCase(),
            custid: g[3],
            in: g[4].toUpperCase()? g[4].toUpperCase():'',
            model: g[1],
            site: g[2].toUpperCase(),
            sn: g[0].toUpperCase()
          }).then(()=>{
            firebase.database().ref('shipTo').child(g[0].toUpperCase()).set({
              cont: this.conList,
              address: c.controls.address.value,
              cig: c.controls.cig.value,
              cup: c.controls.cup.value
            })
          })
          this.childAdd['sn']=g[0].toUpperCase()
          firebase.database().ref('Categ').child(this.serial).set(this.childAdd)
          .then(()=>{
            this.sendNot(g[0].toUpperCase(),g[1],g[5].toUpperCase())
          })
          this.router.navigate(['machine', {sn: this.serial}])
          firebase.database().ref('Updates').child('MOLupd').set(moment.tz(new Date(),environment.zone).format('YYYYMMDDHHmmss'))
        }
      })
    }
  }

  getCustInfo(){
    this.track()
    this.addr=[]
    return new Promise((res,rej)=>{
      this.conList={}
      this.shipTo.controls.address.setValue('')
      this.shipTo.controls.cig.setValue('')
      this.shipTo.controls.cup.setValue('')
      firebase.database().ref('CustContacts').child(this.custId).on('value',a=>{
        if(a.val()!=null){
          this.custCon=[]
          a.forEach(b=>{
            this.custCon.push({name: b.val().name,surname: b.val().surname, mail: b.val().mail, contId:b.val().contId})
          })
          this.spin=false
        } else {
          this.spin=false
        }
      })
      firebase.database().ref('CustAddress').child(this.custId).on('value',a=>{
        if(a.val()!=null) this.addr=Object.values(a.val()).map((b:any)=>{return b.add}).sort()
        res('ok')
      })
    })
  }

  addAdd(){
    const dialogR = this.dialog.open(NewaddressComponent)
    dialogR.afterClosed().subscribe(a=>{
      if(a!=undefined && a!='') {
        let b:string = this.makeId.makeId(8)
        if(!this.addr.includes(a)){
          firebase.database().ref('CustAddress').child(this.custId).child(b).set({
            add: a
          })
          .then(()=>{
            this.shipTo.controls.address.setValue(a)
          })
        } else {
          alert('Address already in the list')
        }
      }
    })
  }

  sendNot(a:string, b:string,c:string){
    let users:string[]=[]
    firebase.database().ref('Users').once('value',a=>{
      a.forEach(b=>{
        if(b.val().Pos=='SU' && b.val()._newrig=='1'){
          if(b.key) users.push(b.key)
        }
      })
    })
    .then(()=>{
      let str= this.addUpd? 'New rig added':'Rig data updated'
      this.notif.newNotification(users,str,b + ' - ' +  a + '(' + c + ')',this.uName,'_newrig', '/machine,{"sn":"' + a + '"}')
    })
  }

  vai(e:any){
    this.segment = e
  }

  chExist(e:any){
    firebase.database().ref('MOL').child(e.target.value.toUpperCase()).once('value',r=>{
      if(r.val()) this.newR.controls.sn.setErrors({already:true})
    })
  }
  
  getData(e:any){
    this.newCategData={}
    this.newCategData.div=e.value.div
    this.newCategData.fam=e.value.fam
    this.newCategData.segment=e.value.segm
    this.newCategData.subCat=e.value.subC
    this.childAdd['div']=e.value.div
    this.childAdd['fam']=e.value.fam
    this.childAdd['segment']=e.value.segm
    this.childAdd['subCat']=e.value.subC
  }

  select(a:MatChip,b:any){
    a.toggleSelected()
    if(a.selected){
      this.conList[b.contId]=b
    } else {
      delete this.conList[b.contId]
    }
    this.track()
    this.checkCon()
  }

  textch(){
    this.checkCon()
  }

  addCon(){
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(NewcontactComponent, {
      data: {id: this.custId, type: 'new'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined) {
        
      }
    })
  }

  checkCon(){
    let a= this.conList
    let b = this.shipTo.controls.address.value
    
    if((Object.values(a)[0]==null || Object.values(a)[0]==undefined) && (b!=null && b!='')) return true
    if((Object.values(a)[0]!=null && Object.values(a)[0]!=undefined) && (b==null || b=='')) return true
    return false
  }

  onCh(a:any){
    
    if(a=='xx') {
    } 
  }

  back(){
    let d =this.dialog.open(ConfirmComponent,{data:{title:'Unsaved Data', msg:'The form contains unsaved data, proceed?'}})
    d.afterClosed().subscribe(res=>{
      if(res) {
        this.location.back()
      }
      d.close()
    })
    
  }
}


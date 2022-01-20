import { Component, OnInit } from '@angular/core';
import { AbstractControl, Form, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'
import { MatFormFieldAppearance } from '@angular/material/form-field';
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
import { InputhrsComponent } from '../../util/dialog/inputhrs/inputhrs.component';
import { NewaddressComponent } from '../../util/dialog/newaddress/newaddress.component';
import { MakeidService } from 'src/app/serv/makeid.service';

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
  appearance:MatFormFieldAppearance="fill"
  newR:FormGroup;
  shipTo:FormGroup;
  addUpd:boolean = true
  segment:boolean = true
  customers:any[]=[]
  pos:string|undefined
  uId:string=''
  uName:string=''
  allow:boolean=false 
  custCon:any[]=[]
  custId:string=''
  conList:any[]=[]
  spin:boolean=true
  addr:any[]=[]
  addV:any
  cId:string=''
  subsList:Subscription[]=[]

  constructor(private auth: AuthServiceService, public notif: NotifService, private fb:FormBuilder, private makeId: MakeidService, private route:ActivatedRoute, private dialog: MatDialog, private router:Router) { 
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

  ngOnInit(): void {
    /*firebase.database().ref('shipTo').once('value',a=>{
      a.forEach(b=>{
        console.log(b.key + ' - ' + b.val().address)

      })
    })*/
    this.subsList.push(this.auth._userData.subscribe(a=>{
      this.uId=a.uid
      this.uName= a.Nome + ' ' + a.Cognome
      this.pos=a.Pos
      setTimeout(() => {
        this.allow=this.auth.allow('newrig')
      }, 1);
    }))
    this.subsList.push(this.auth._customers.subscribe(a=>this.customers=a))
    this.subsList.push(this.auth._fleet.subscribe(a=>{this.rigs=a}))
    this.allow=this.auth.allow('newrig')
  
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
        this.getCustInfo()
        .then(()=>{
          //console.log(!this.addr.includes(a.val().address))
          firebase.database().ref('shipTo').child(this.serial).once('value',a=>{
            if(a && a.val() && a.val().cont) {
              a.val().cont.forEach((e:any) => {
                this.conList.push(e)
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
            }
          }) 
        })
        this.newR.controls['sn'].disable()
        firebase.database().ref('Categ').child(this.serial).once('value',g=>{
          this.rigCat=[g.val()]
          if(this.rigCat.length>0) this.child=1
        })
      } else {
        this.rou=['rigs']
      }
    })
    setTimeout(() => {
      this.checkCon()
    }, 1000);
  }

  chSel(c:MatChip, e:any){
    if(this.conList.map(a=>{return a.name}).includes(e.name)) return true
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
      this.router.navigate(['machine', {sn: g[0].toUpperCase()}])
      this.sendNot(g[0].toUpperCase(),g[1],g[5].toUpperCase())
    }
    if(a=='updr' && this.allow){
      const dialogconf = new MatDialogConfig();
      dialogconf.disableClose=false;
      dialogconf.autoFocus=false;
      const dialogRef = this.dialog.open(UpddialogComponent, {
        data: {sn: this.serial}
      });
      // ADD check per modifica matricola
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
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
          
        }
      })
    }
  }

  getCustInfo(){
    this.addr=[]
    return new Promise((res,rej)=>{
      this.conList=[]
      this.shipTo.controls.address.setValue(null)
      this.shipTo.controls.cig.setValue(null)
      this.shipTo.controls.cup.setValue(null)
      firebase.database().ref('Contacts').child(this.custId).on('value',a=>{
        this.custCon=[]
        a.forEach(b=>{
          this.custCon.push({name: b.val().name, mail: b.val().mail})
        })
        this.spin=false
      })
      firebase.database().ref('CustAddress').child(this.custId).on('value',a=>{
        a.forEach(b=>{
          this.addr.push(b.val().add)
        })
        res('ok')
      })
    })
  }

  addAdd(){
    const dialogR = this.dialog.open(NewaddressComponent)
    dialogR.afterClosed().subscribe(a=>{
      if(a!=undefined) {
        let b:string = this.makeId.makeId(8)
        let c:any={}
        firebase.database().ref('CustAddress').child(this.custId).child(b).set({
          add: a
        })
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
      this.notif.newNotification(users,str,b + ' - ' +  a + '(' + c + ')',this.uName,'newrig', './machine,{"sn":"' + a + '"}')
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
    this.childAdd['div']=e.value.div
    this.childAdd['fam']=e.value.fam
    this.childAdd['segment']=e.value.segm
    this.childAdd['subCat']=e.value.subC
  }

  select(a:MatChip,b:string){
    a.toggleSelected()
    if(a.selected){
      this.conList.push(b)
    } else {
      this.conList.splice(this.conList.indexOf(b),1)
    }
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
    let a= this.conList.length>0 && ((this.shipTo.controls.address.value!=null && this.shipTo.controls.address.value!='')||this.shipTo.controls.address.value!='xx')
    let b = this.conList.length==0 && (this.shipTo.controls.address.value==null|| this.shipTo.controls.address.value=='' || this.shipTo.controls.address.value!='xx')
    if(a||b) {
      this.shipTo.controls.address.setErrors(null)
    } else {
      this.shipTo.controls.address.setErrors({})
    }
  }

  onCh(a:any){
    if(a=='xx') {
    } 
  }
}


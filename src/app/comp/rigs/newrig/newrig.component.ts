import { Component, OnInit } from '@angular/core';
import { Form, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { FormBuilder } from '@angular/forms'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { UpddialogComponent } from '../../util/dialog/upddialog/upddialog.component'
import { NotifService } from '../../../serv/notif.service'
import { UsersComponent } from '../../users/users.component';

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
  rig: string[]=[]
  appearance:MatFormFieldAppearance="fill"
  newR:FormGroup;
  addUpd:boolean = true
  segment:boolean = true
  customers:any[]=[]
  pos:string|undefined
  uId:string=''
  uName:string=''
  constructor(public notif: NotifService, private fb:FormBuilder, private route:ActivatedRoute, private dialog: MatDialog, private router:Router) { 
    this.newR = fb.group({
      sn:['', [Validators.required]],
      model:['', [Validators.required]],
      site:[''],
      customer:['',[Validators.required]],
      in: ['']
    })
  }

  ngOnInit(): void {
    
    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref('Users/' + a?.uid).once('value',b=>{
        this.uId!=a?.uid
        this.uName= b.val().Nome + ' ' + b.val().Cognome
        this.pos=b.val().Pos
      })
    })
    this.route.params.subscribe(a=>{
      this.serial= a.name
      if(this.serial!=undefined) {
        this.rou=['machine',{sn: this.serial}]
        firebase.database().ref('MOL/' + this.serial).once('value',a=>{
          this.rig=a.val()
          this.addUpd=false
          this.newR = this.fb.group({
            sn:[a.val().sn,  [Validators.required]],
            model:[a.val().model, [Validators.required]],
            site:[a.val().site],
            customer:[a.val().custid,[Validators.required]],
            in: [a.val().in]
          })
          this.newR.controls['sn'].disable()
        })
        .then(()=>{
          firebase.database().ref('Categ/' + this.serial).once('value',g=>{
            this.rigCat=[g.val()]
            if(this.rigCat.length>0) this.child=1
          })
        })
      } else {
        this.rou=['rigs']
      }
    })
    firebase.database().ref('CustomerC').once('value',a=>{
      a.forEach(b=>{
        this.customers.push({id: b.val().id, c1: b.val().c1})
      })
    })
    .then(()=>{
      this.customers.sort((a: any, b: any) => {
        if (a['c1'] < b['c1']) {
          return -1;
        } else if (a['c1'] > b['c1']) {
          return 1;
        } else {
          return 0;
        }
      })
    })
  }

  datiC(a:FormGroup){
    //console.log(this.newR.controls.sn.invalid,a.get('sn')?.invalid)
    let g = [(a.get('sn')?.invalid)?'':a.get('sn')?.value,a.get('model')?.value, a.get('customer')?.value]
    g.push(this.child)
    return g
  }

  add(a:any,b:FormGroup){
    let g:string[] = [b.get('sn')?.value,b.get('model')?.value,b.get('site')?.value, b.get('customer')?.value, b.get('in')?.value]
    Object.values(this.customers).map(f=>{if(f.id==g[3]) g[5]=(f.c1)})
    if(a=='addr' && this.pos=='SU'){
      firebase.database().ref('MOL/' + g[0].toUpperCase()).set({
        custid: g[3],
        customer: g[5].toUpperCase(),
        in: g[4].toUpperCase()? g[4].toUpperCase(): '',
        model: g[1],
        site: g[2].toUpperCase(),
        sn: g[0].toUpperCase()
      })
      firebase.database().ref('RigAuth/' + g[0].toUpperCase()).set({
        a1:'0',a2:'0',a3:'0',a4:'0',a5:'0',sn:g[0].toUpperCase()
      })
      this.childAdd['sn']=g[0].toUpperCase()
      firebase.database().ref('Categ/').child(g[0].toUpperCase()).set(this.childAdd)
      this.router.navigate(['machine', {sn: g[0].toUpperCase()}])
      this.sendNot(g[0].toUpperCase(),g[1],g[5].toUpperCase())
    }
    if(a=='updr' && this.pos=='SU'){
      const dialogconf = new MatDialogConfig();
      dialogconf.disableClose=false;
      dialogconf.autoFocus=false;
      const dialogRef = this.dialog.open(UpddialogComponent, {
        data: {sn: this.serial}
      });
      // ADD check per modifica matricola
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          firebase.database().ref('MOL/' + this.serial).set({
            customer: g[5].toUpperCase(),
            custid: g[3],
            in: g[4].toUpperCase()? g[4].toUpperCase():'',
            model: g[1],
            site: g[2].toUpperCase(),
            sn: g[0].toUpperCase()
          })
          this.childAdd['sn']=g[0].toUpperCase()
          firebase.database().ref('Categ/'+ this.serial).set(this.childAdd)
          .then(()=>{
            this.sendNot(g[0].toUpperCase(),g[1],g[5].toUpperCase())
          })
          this.router.navigate(['machine', {sn: this.serial}])
          
        }
      })
    }    
  }


  sendNot(a:string, b:string,c:string){
    let users:string[]=[]
    firebase.database().ref('Users').once('value',a=>{
      a.forEach(b=>{
        if(b.val().Pos=='SU' && b.val().newrig=='1'){
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
}

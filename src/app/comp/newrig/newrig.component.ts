import { Component, OnInit } from '@angular/core';
import { Form, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { FormBuilder } from '@angular/forms'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { UpddialogComponent } from '../dialog/upddialog/upddialog.component'


@Component({
  selector: 'episjob-newrig',
  templateUrl: './newrig.component.html',
  styleUrls: ['./newrig.component.scss']
})
export class NewrigComponent implements OnInit {
  child:number=0
  childAdd:any
  serial:string=''
  rigCat:any[]=[]
  rou:any[]=[]
  rig: string[]=[]
  appearance:MatFormFieldAppearance="fill"
  newR:FormGroup;
  addUpd:boolean = true
  customers:string[]=[]
  pos:string|undefined
  constructor(private fb:FormBuilder, private route:ActivatedRoute, private dialog: MatDialog, private router:Router) { 
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
      firebase.database().ref('Users/' + a?.uid).child('Pos').once('value',b=>{
        this.pos=b.val()
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
            customer:[a.val().customer,[Validators.required]],
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
    firebase.database().ref('Customers').on('value',a=>{
      a.forEach(b=>{
        this.customers.push(b.val().c1)
      })
    })
  }

  datiC(a:FormGroup){
    let g = [a.get('sn')?.value,a.get('model')?.value, a.get('customer')?.value]
    g.push(this.child)
    return g
  }

  add(a:any,b:FormGroup){
    let g:string[] = [b.get('sn')?.value,b.get('model')?.value,b.get('site')?.value, b.get('customer')?.value, b.get('in')?.value]
    //let c:string[] = 
    if(a=='addr' && this.pos=='SU'){
      firebase.database().ref('MOL/' + g[0].toUpperCase()).set({
        customer: g[3].toUpperCase(),
        in: g[4].toUpperCase()? g[4].toUpperCase(): '',
        model: g[1],
        site: g[2].toUpperCase(),
        sn: g[0].toUpperCase()
      })
      firebase.database().ref('RigAuth/' + g[0].toUpperCase()).set({
        a1:0,a2:0,a3:0,a4:0,sn:g[0].toUpperCase()
      })
      this.childAdd['sn']=g[0].toUpperCase()
      firebase.database().ref('Categ/'+ g[0].toUpperCase()).set(this.childAdd)
      this.router.navigate(['machine', {sn: g[0].toUpperCase()}])
    }
    if(a=='updr' && this.pos=='SU'){
      const dialogconf = new MatDialogConfig();
      dialogconf.disableClose=false;
      dialogconf.autoFocus=false;
      const dialogRef = this.dialog.open(UpddialogComponent, {
        data: {name: this.serial}
      });
      // ADD check per modifica matricola
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          firebase.database().ref('MOL/' + this.serial).set({
            customer: g[3].toUpperCase(),
            in: g[4].toUpperCase(),
            model: g[1],
            site: g[2].toUpperCase(),
            sn: g[0].toUpperCase()
          })
          this.childAdd['sn']=g[0].toUpperCase()
          firebase.database().ref('Categ/'+ this.serial).set(this.childAdd)
          this.router.navigate(['machine', {sn: this.serial}])
        }
      })
    }
  }
  vai(e:any){
    this.child=e[0]
    this.childAdd=e[1]
  }
}

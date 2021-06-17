import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common'
import { MatDialog,MatDialogConfig } from '@angular/material/dialog'
import { UpddialogComponent } from '../dialog/upddialog/upddialog.component'
import firebase from 'firebase'
import 'firebase/database'
import 'firebase/auth'

export interface cl {
  c1: string
  c2: string
  c3: string
}

@Component({
  selector: 'episjob-newcust',
  templateUrl: './newcust.component.html',
  styleUrls: ['./newcust.component.scss']
})
export class NewcustComponent implements OnInit {
  @Output() dati = new EventEmitter<string>()
  newC:FormGroup;
  appearance:MatFormFieldAppearance="fill"
  addUpd:boolean=true
  origin:string[]=[]
  pos:string=''
  rou:any[]=[]
  constructor(private fb:FormBuilder, private location:Location, private route:ActivatedRoute, private router:Router, private dialog:MatDialog) {
    this.newC = fb.group({
      name:['',[Validators.required]],
      address1: ['',[Validators.required]],
      address2: ['',[Validators.required]],
    })
   }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(a=>{
      firebase.database().ref('Users/' + a?.uid).child('Pos').on('value',b=>{
        this.pos = b.val()
      })
    })
    
    this.route.params.subscribe(a=>{
      if(a.c1 && a.c2 && a.c3) {
        this.origin=[a.c1,a.c2,a.c3]
        this.newC = this.fb.group({
          name:[a.c1,[Validators.required]],
          address1: [a.c2,[Validators.required]],
          address2: [a.c3,[Validators.required]],
        })
        this.addUpd=false
        this.rou=['cliente',{cust1: a.c1,cust2:a.c,cust3:a.c3}]
      } else {
        this.rou=['customers']
      }
    })
  }

  add(e:any, a:FormGroup){
    let g:cl ={
      c1: a.get('name')?.value.toUpperCase(),
      c2: a.get('address1')?.value.toUpperCase(),
      c3: a.get('address2')?.value.toUpperCase()
    }
    if(e=='updc'){
      const dialogconf = new MatDialogConfig();
      dialogconf.disableClose=false;
      dialogconf.autoFocus=false;
      const dialogRef = this.dialog.open(UpddialogComponent, {
        data: {name: this.origin[0]!=undefined?this.origin[0]: ''}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result!=undefined && this.pos=='SU') {
          firebase.database().ref('Customers/'+g.c1.replace(/\./g,'')).set(g)
          .then(()=>{
            if(this.origin[0]!=g.c1){
              firebase.database().ref('MOL/').orderByChild('customer').equalTo(this.origin[0].toUpperCase()).once('value',f=>{
                Object.keys(f.val()).forEach(e=>{
                  firebase.database().ref('MOL/' + e + '/customer').set(g.c1)
                })
              })
            }
            this.location.back()
          })
          .catch(err=> console.log(err))
        }
      })
    } else if(e=='addc'){
        firebase.database().ref('Customers/'+g.c1.replace(/\./g,'')).set(g)
        .then(()=>{this.location.back()})
        .catch(err=> console.log(err))
    }
  }

  back(){
    this.location.back()
  }

  datiC( a:FormGroup){
    let g:cl ={
      c1: a.get('name')?.value,
      c2: a.get('address1')?.value,
      c3:a.get('address2')?.value
    }
    return [g.c1? g.c1:'',g.c2?g.c2:'',g.c3?g.c3:'']
  }
}

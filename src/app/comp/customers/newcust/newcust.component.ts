import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common'
import { MatDialog,MatDialogConfig } from '@angular/material/dialog'
import { UpddialogComponent } from '../../util/upddialog/upddialog.component'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

export interface cl {
  c1: string
  c2: string
  c3: string
  id: string
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
      if(a.id && a.c1 && a.c2 && a.c3) {
        this.origin=[a.id,a.c1,a.c2,a.c3]
        this.newC = this.fb.group({
          name:[a.c1,[Validators.required]],
          address1: [a.c2,[Validators.required]],
          address2: [a.c3,[Validators.required]],
        })
        this.addUpd=false
        this.rou=['cliente',{id: a.id}]
      } else {
        this.rou=['customers']
      }
    })
  }

  add(e:any, a:FormGroup){
    let g:cl ={
      c1: a.get('name')?.value.toUpperCase(),
      c2: a.get('address1')?.value.toUpperCase(),
      c3: a.get('address2')?.value.toUpperCase(),
      id: this.origin[0]!=''? this.origin[0] : this.makeid(10)
    }
    if(e=='updc' && this.pos=='SU'){
      const dialogconf = new MatDialogConfig();
      dialogconf.disableClose=false;
      dialogconf.autoFocus=false;
      const dialogRef = this.dialog.open(UpddialogComponent, {
        data: {cust: this.origin[1]!=undefined?this.origin[1]: '', name: this.origin[0]}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result!=undefined && this.pos=='SU') {
          //firebase.database().ref('Customers/'+this.origin[0]).remove()
          firebase.database().ref('CustomerC/').child(this.origin[0]).set(g)
          .then(()=>{
            if(this.origin[1]!=g.c1){
              firebase.database().ref('MOL/').orderByChild('customer').equalTo(this.origin[1]).once('value',f=>{
                Object.keys(f.val()).forEach(e=>{
                  firebase.database().ref('MOL/' + e + '/customer').set(g.c1)
                })
              })
            }
            this.router.navigate(['cliente',{id:this.origin[0]}])
          })
          .catch(err=> console.log(err))
        }
      })
    } else if(e=='addc' && this.pos=='SU'){
        let newId = this.makeid(10)
        g.id = newId
        firebase.database().ref('CustomerC/').child(newId).set(g)
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
      c3:a.get('address2')?.value,
      id: this.origin[0]
    }
    return [g.c1? g.c1:'',g.c2?g.c2:'',g.c3?g.c3:'']
  }

  makeid(length:number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
}

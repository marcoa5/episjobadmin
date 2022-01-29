import { Component, OnInit } from '@angular/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { ActivatedRoute, Router } from '@angular/router'
import { DeldialogComponent } from '../../util/dialog/deldialog/deldialog.component'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { Location } from '@angular/common'
import { Subscription } from 'rxjs';
import { auth } from 'firebase-admin';
import { AuthServiceService } from 'src/app/serv/auth-service.service';

@Component({
  selector: 'episjob-newtech',
  templateUrl: './newtech.component.html',
  styleUrls: ['./newtech.component.scss']
})
export class NewtechComponent implements OnInit {
  appearance:MatFormFieldAppearance="fill"
  addUpd:boolean = true
  newT:FormGroup;
  pos:string=''
  origName:string|undefined
  allow:boolean=false
  subsList:Subscription[]=[]

  constructor(public auth:AuthServiceService, private fb:FormBuilder, private router:Router, private route:ActivatedRoute, private dialog: MatDialog, private location: Location) { 
    this.newT = fb.group({
      fn:['', [Validators.required]],
      sn:['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        setTimeout(() => {
          this.allow=this.auth.allow('technicians',this.pos)
        }, 1);
      })
    )

    this.route.params.subscribe(a=>{
      this.origName = a.fn
      if(this.origName!=undefined) {
        this.newT = this.fb.group({
          fn:[a.fn, [Validators.required]],
          sn: [a.sn, [Validators.required]],
        })
        this.addUpd = false
      }
    })
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  datiC(a:FormGroup){
    let g = [a.get('fn')?.value,a.get('sn')?.value]
    return g
  }

  add(a:any,b:FormGroup){
    let g:string[] = [b.get('fn')?.value,b.get('sn')?.value]
    if(a=='addt' && this.pos=='SU'){
      firebase.database().ref('Tech/' + g[0].toUpperCase()).set({
        s: g[1].toUpperCase(),
      }).then(()=>{
        this.location.back()
      })
      
    }
    if(a=='updt' && this.pos=='SU'){
      firebase.database().ref('Tech/' + this.origName).remove()
      .then(()=>{
        firebase.database().ref('Tech/' + g[0].toUpperCase()).set({
          s: g[1].toUpperCase(),
        })
        .then(()=>{
          this.location.back()
        })
      })
    }
  }

  cancella(){
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(DeldialogComponent, {
      data: {name: this.origName}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined && this.pos=='SU') {
        firebase.database().ref('Tech/' + result).remove()
        this.location.back()
      }
    });
  }
}

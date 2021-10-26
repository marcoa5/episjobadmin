import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient, HttpParams} from '@angular/common/http'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { FormGroup, FormBuilder, Validators, Form } from '@angular/forms'
import { MatFormFieldAppearance } from '@angular/material/form-field'
import { DeldialogComponent } from '../../util/deldialog/deldialog.component'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { Location } from '@angular/common'


export interface utente {
  nome?: string|''
  cognome?: string|''
  mail?: string|''
  posiz?: string|''
}

@Component({
  selector: 'episjob-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.scss']
})
export class NewuserComponent implements OnInit {
  addUpd:boolean = true
  id:string=''
  mail:string=''
  pos: string|undefined
  data: utente | undefined
  userF:FormGroup
  appearance:MatFormFieldAppearance="fill"
  userpos:string|undefined
  constructor(private router: Router, private http:HttpClient, private route: ActivatedRoute, private fb: FormBuilder, private location:Location, private dialog: MatDialog) {
    this.userF = fb.group({
      nome: ['', [Validators.required]],
      cognome: ['', [Validators.required]],
      mail: ['', [Validators.required, Validators.email]],
      posiz: ['', [Validators.required]],
    })
   }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(us=>{
      firebase.database().ref('Users/' + us?.uid).on('value',u=>{
        this.pos=u.val().Pos
      })
    })
    this.route.params.subscribe(a=>{
      this.id=a.id
      this.mail=a.mail
      if(this.id!=undefined && this.mail!=undefined) {
        this.addUpd=false
        this.id=a.id
        this.mail=a.mail
        firebase.database().ref('Users/' + this.id).on('value',b=>{
          this.data={
            mail:this.mail,
            nome: b.val().Nome, 
            cognome: b.val().Cognome,
            posiz: b.val().Pos
          }
          this.userpos = b.val().Pos
          this.userF.setValue(this.data)
          this.userF.get('mail')?.disable()
        }) 
      }
    })
  }


  datiC(a:FormGroup){
    let g= [a.get('nome')?.value,a.get('cognome')?.value,a.get('mail')?.valid || a.get('mail')?.disabled? a.get('mail')?.value:'',this.userpos]
    return g
  }

  add(a:string, b:FormGroup){
    console.log(a, b.get('nome')?.value, 
    b.get('cognome')?.value, 
    b.get('mail')?.value, 
    this.userpos)
    let params = new HttpParams()
    .set('Nome', b.get('nome')?.value)
    .set('Cognome',b.get('cognome')?.value)
    .set('Mail',b.get('mail')?.value)
    .set('Pos',this.userpos?this.userpos:'tech')
    .set('km','0.05')
    this.http.get('https://episjobreq.azurewebsites.net/createuser',{params:params}).subscribe(a=>{
      console.log(a)
    })
    setTimeout(() => {
      this.location.back()
    }, 200);
  }

  cancella(){
    const dialogconf = new MatDialogConfig();
    dialogconf.disableClose=false;
    dialogconf.autoFocus=false;
    const dialogRef = this.dialog.open(DeldialogComponent, {
      data: {name: `${this.data?.nome} ${this.data?.cognome}`, id:this.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined && this.pos=='SU') {
        let params = new HttpParams()
        .set('id', result.id)
        this.http.get('https://episjobreq.azurewebsites.net/delete',{params:params}).subscribe(a=>{
          console.log(a)
        })
        setTimeout(() => {
          this.location.back()
        }, 200);
      }
    });
  }

}

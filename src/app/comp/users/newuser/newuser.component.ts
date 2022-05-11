import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { HttpClient, HttpParams} from '@angular/common/http'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { FormGroup, FormBuilder, Validators, Form, AbstractControl } from '@angular/forms'
import { MatFormFieldAppearance } from '@angular/material/form-field'
import { DeldialogComponent } from '../../util/dialog/deldialog/deldialog.component'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { Location } from '@angular/common'
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { environment } from 'src/environments/environment';


export interface utente {
  nome?: string|''
  cognome?: string|''
  mail?: string|''
  posiz?: string|''
  cV?: boolean
  area?: number
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
  pos: string=''
  data: utente | undefined
  userF:FormGroup
  appearance:MatFormFieldAppearance="fill"
  userpos:string|undefined
  userVisit:boolean = false
  allow:boolean=false
  subsList:Subscription[]=[]

  constructor(private auth: AuthServiceService, private router: Router, private http:HttpClient, private route: ActivatedRoute, private fb: FormBuilder, private location:Location, private dialog: MatDialog) {
    this.userF = fb.group({
      nome: ['', [Validators.required]],
      cognome: ['', [Validators.required]],
      mail: ['', [Validators.required, Validators.email]],
      posiz: ['', [Validators.required]],
      area: 0,
      cV: [false]
    }, {
      validators: [this.areaValidator]
  })
   }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        setTimeout(() => {
          this.allow=this.auth.allow('SU',this.pos)
        }, 1);
      })
    )
    this.route.params.subscribe(a=>{
      this.id=a.id
      this.mail=a.mail
      if(this.id!=undefined && this.mail!=undefined) {
        this.addUpd=false
        this.id=a.id
        this.mail=a.mail
        
        firebase.database().ref('Users').child(this.id).on('value',b=>{
          let oi=b.val().userVisit!=undefined? (b.val().userVisit=='true'?true : false):false
          this.data={
            mail:this.mail,
            nome: b.val().Nome, 
            cognome: b.val().Cognome,
            posiz: b.val().Pos,
            cV: oi,
            area: b.val().Area? b.val().Area: null
          }
          this.userVisit = oi
          this.userF.controls.cV.setValue(oi)
          this.userpos = b.val().Pos
          this.userF.setValue(this.data)
          this.userF.get('mail')?.disable()
        }) 
      }
    })
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  add(a:string, b:FormGroup){
    let url:string = environment.url
    let params = new HttpParams()
    .set('Mail',b.get('mail')?.value)
    .set('Nome', b.get('nome')?.value)
    .set('Cognome',b.get('cognome')?.value)
    .set('Pos',this.userpos?this.userpos:'tech')
    .set('km', '0.06')
    .set('id', this.id)
    .set('userVisit', this.userVisit + '')
    .set('Area', b.get('area')?.value)
    if(a=='addu') params.set('Mail', b.get('mail')!.value)
    if(a=='addu') {
        this.http.get(url + 'createuser',{params:params}).subscribe(()=>{console.log('added')})
    } else if(a=='updu'){
      this.http.get(url + 'updateuser',{params:params}).subscribe(()=>{console.log('updated')})
    }
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
      if(result!=undefined && this.auth.acc('SURights')) {
        let params = new HttpParams()
        .set('id', result.id)
        let url:string=environment.url
        this.http.get(url + 'delete',{params:params}).subscribe(a=>{

        })
        setTimeout(() => {
          this.location.back()
        }, 200);
      }
    });
  }

  ch(){
  }

  chSel(e:any){
    this.userVisit=e.checked
  }

  areaValidator(a: { controls: { posiz: { value: string; }; }; get: (arg0: string) => AbstractControl; } | null){
    if(a!=null && a.controls.posiz.value=='sales'){
      return Validators.required(a.get('area')) ? {
        myEmailFieldConditionallyRequired: true,
      } : null;
    }
    return false
  }
}
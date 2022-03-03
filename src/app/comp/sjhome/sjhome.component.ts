import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import firebase from 'firebase/app'
import { ActivatedRoute, ChildActivationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeldialogComponent } from '../util/dialog/deldialog/deldialog.component';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { GenericComponent } from '../util/dialog/generic/generic.component';

@Component({
  selector: 'episjob-sjhome',
  templateUrl: './sjhome.component.html',
  styleUrls: ['./sjhome.component.scss']
})
export class SjhomeComponent implements OnInit {
  pos:string=''
  userId:string=''
  allow:boolean=false
  subsList:Subscription[]=[]
  _list:any=[]
  list:any=[]
  list1:any=[]
  sjId:string=''
  sjUrl:number=-1
  _listSent:any=[]
  listSent:any=[]
  spin:boolean=false
  draftSel:boolean=false
  sentSel:boolean=false
  chDel:boolean=false
  constructor(private auth: AuthServiceService, private router:Router, private dialog: MatDialog, private http: HttpClient, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) {
          this.pos=a.Pos
          this.userId=a.uid
        }
        setTimeout(() => {
          this.allow= this.auth.allow('sj',this.pos)
        }, 1);
      })
    )
    if(navigator.onLine) {
      this.syncSignature()
      this.checkApproval()
      .then((a)=>{
        console.log(a)
        this.loadSent()
      })
      this.checkDeleted()
      .then(()=>{
        this.syncDraft()
        .then(()=>{
          this.loadSJ()
        })
      })
    } else {
      this.loadSJ()
    }
  }

  syncDraft(){
    return new Promise((res,rej)=>{
      this.spin=true
      this.fromLocalToServer()
      .then((a)=>{
        console.log(a)
        this.fromServerToLocal()
        .then(b=>{
          console.log(b)
          this.spin=false
          res('ok')
        })
        .catch(err=>{
          console.log(err)
          this.spin=false
        })
      })
      .catch(err=>{
        console.log(err)
        this.fromServerToLocal()
        .then(b=>{
          console.log(b)
          this.spin=false
          res('ok')
        })
        .catch(err=>{
          console.log(err)
          this.spin=false
        })
      })
    })
  }

  fromLocalToServer(){
    let kt:number=0
    return new Promise((res,rej)=>{
      setTimeout(() => {
        rej('error')
      }, 2000);
      for(let i=0; i<localStorage.length;i++){
        let k:string|null = localStorage.key(i)
        if(k?.substring(0,7)=="sjdraft"){
          let _info:string|null = localStorage.getItem(k)
          if(_info) {
            firebase.database().ref('sjDraft').child('deleted').child(k).once('value',y=>{
              if(y.val()!=null) {
                localStorage.removeItem(k!)
                console.log('REMOVED ' + k!)
              }
            }).then(()=>{
              firebase.database().ref('sjDraft').child('sent').child(k!).once('value',y=>{
                if(y.val()!=null) {
                  console.log(k)
                  localStorage.removeItem(k!)
                  console.log('REMOVED ' + k!)

                }
              }).then(()=>{
                firebase.database().ref('sjDraft').child('draft').child(k!).once('value',y=>{
                  let l:string|undefined=undefined, s:string
                  if(_info) l=JSON.parse(_info).lastM
                  s=y.val()?.lastM
                  if((l && l>s) || s==null) {
                    console.log('local')
                    let t:string|null = localStorage.getItem(k!)
                    if(k) firebase.database().ref('sjDraft').child('draft').child(k).set(JSON.parse(t!))
                  } else if(l!<s){
                    console.log('server')
                    if(k) localStorage.setItem(k, JSON.stringify(y.val()))
                  } else if(l==s){
                    console.log('uguale')
                  }
                })
                .then(()=>{
                  kt++
                  if(kt==localStorage.length) res('LtoS sync completed')
                })
                .catch(err=>{
                  console.log('ERRORE: '+ err)
                  kt++
                  if(kt==localStorage.length) res('LtoS  sync completed')
                })
              }).catch(err=>console.log('ERRORE: '+ err))
            }).catch(err=>console.log('ERRORE: '+ err))         
          }
        } else {
          kt++
          if(kt==localStorage.length) res('LtoS  sync completed')
        }
      }
    })
  }

  fromServerToLocal(){
    let s:number=0, l:number=0, kt:number=0
    return new Promise((res,rej)=>{
      setTimeout(() => {
        rej('error')
      }, 2000);
      firebase.database().ref('sjDraft').child('draft').once('value',draft=>{
        if(draft.val()!=null){
          let _draft =Object.values(draft.val())
          let length:number=_draft.length
          draft.forEach(d=>{
            if(((this.pos=='tech' && d.val().authorId==this.userId)|| this.pos!='tech')&&(d.val()!=null && ((d.val().userId==this.userId && this.pos=='tech')|| (this.pos!='tech')))) {
              s=parseInt(d.val().lastM)
              let _l
              _l=localStorage.getItem(d.key!)
              if(_l) l=JSON.parse(_l!).lastM
              if(l>s){
                console.log('local')
                firebase.database().ref('sjDraft').child('draft').child(d.key!).set(
                  JSON.parse(localStorage.getItem(d.key!)!)
                )
              } else if(s>l){
                console.log('server')
                localStorage.setItem(d.key!,JSON.stringify(d.val()))
              } else if(s==l){
                console.log('uguale')
              }
            }
            kt++
            if(kt==length) res('StoL  sync completed')
          })
        } else {
          res('StoL sync completed')
        }
      })
    })
  }

  loadSJ(){
    this.list=[]
    let l = localStorage.length
    let k:number=0
    for(let i=0;i<localStorage.length;i++){
      if(localStorage.key(i)?.substring(0,7)=="sjdraft" && JSON.parse(localStorage.getItem(localStorage.key(i)!)!).status!='deleted'){
        this.list.push(JSON.parse(localStorage.getItem(localStorage.key(i)!)!))
        k++     
      } else {
        k++
      }
      if(k==l) this.list1=this.list
    }
  }

  loadSent(){
    firebase.database().ref('sjDraft').child('sent').on('value',a=>{
      this._listSent=[]
      a.forEach(b=>{
        if(this.pos=='tech' && this.userId==b.val().authorId) {
          this._listSent.push(b.val())
        } else if(this.pos!='tech'){
          this._listSent.push(b.val())
        }
      })
      this.listSent=this._listSent
    })   
  }

  checkDeleted(){
    return new Promise((res,rej)=>{
      let l = localStorage.length
      let k:number=0
      let nuo:any
      for(let i=0;i<localStorage.length;i++){
        if(localStorage.key(i)?.substring(0,7)=="sjdraft" && JSON.parse(localStorage.getItem(localStorage.key(i)!)!).status=='deleted'){
          nuo=JSON.parse(localStorage.getItem(localStorage.key(i)!)!)
          let keyLS:string=localStorage.key(i)!
          firebase.database().ref('sjDraft').child('deleted').child(keyLS).set(nuo)
          .then(()=>{
            firebase.database().ref('sjDraft').child('draft').child(keyLS).remove()
            .then(()=>{
              localStorage.removeItem(keyLS)
              console.log('REMOVED ' + keyLS)
            })
          })
        }
        if(i==l-1) res('ok')
      }
    })
  }

  checkApproval(){
    let kt:number =0
    return new Promise((res,rej)=>{
      let l = localStorage.length
      for(let i=0;i<l;i++){
        if(localStorage.key(i)?.substring(0,6)=="sjsent" ){
          let keyLS:string=localStorage.key(i)!
          let content:string=localStorage.getItem(localStorage.key(i)!)!
          let cont = JSON.parse(content)
          firebase.database().ref('sjDraft').child('sent').child(keyLS).set(JSON.parse(localStorage.getItem(keyLS)!))
          .then(()=>{
            localStorage.removeItem(keyLS)
            console.log('REMOVED ' + keyLS)
            //let url:string='http://localhost:3001/'; cont.info.cc=false
            let url:string='https://episjobreq.herokuapp.com/'; cont.info.cc=true
            this.http.post(url + 'sendSJNew',cont).subscribe((res)=>{
              let info={
                fileName: cont.info.fileName,
                urlPdf: cont.info.urlPdf
              }
              console.log(res) 
              let _mails = cont.elencomail.split(';')
              let mail = _mails.join(', ')
              this._snackBar.open('Mail sent to ' + mail,'',{duration:8000})
            })
            kt++
            if(kt==l) {
              res('Sent checked')
            }
            
          })
          
          
        } else {
          kt++
          if(kt==l) {
            res('Sent checked')
          }
        }
      }
    })
  }

  go(){
    this.router.navigate(['newsj']) 
  }

  open(){
    this.router.navigate(['newsj', {id:this.sjId,type:this.sjId.substring(2,3)}])
  }

  chW(): boolean{
    if(window.innerWidth>850) return true
    return false
  }

  delete(){
    let del= this.sjId
    const dialogRef = this.dialog.open(DeldialogComponent, {disableClose:true, data: {name:'Service Job draft'}})
    dialogRef.afterClosed().subscribe(res=>{
      if(res!=undefined){
        localStorage.removeItem(del)
        console.log('REMOVED ' + del)
        if(navigator.onLine){
          firebase.database().ref('sjDraft').child('draft').child(del).remove()
          .then(()=>{
            firebase.database().ref('sjDraft').child('deleted').child(del).set({
              lastM: moment(new Date()).format('YYYYMMDDHHmmss'),
              status: 'deleted'
            })
          })
          .then(()=>{
            this.syncDraft()
            .then(()=>{
              this.loadSJ()
            })
          })
        } else {
          this.loadSJ()
        }
      }
      this.unSelect()
    }) 
  }

  unSelect(){
    this.list1.forEach((a:any)=>{
      a.sel=0
    })
    this.listSent.forEach((a:any)=>{
      a.sel=0
    })
    this.sjId=''
  }

  getFile(){
    let file:any|undefined
    return new Promise((res,rej)=>{
      if(this.sjId.substring(0,3)=='sjs') {
        firebase.database().ref('sjDraft').child('sent').child(this.sjId).once('value',a=>{
          file  =a.val()
        })
        .then(()=>{
          res(file)
        })
        .catch(err=>{
          rej(err)
        })
      } else {
        file = JSON.parse(localStorage.getItem(this.sjId)!)
        res(file)
      } 
    })
  }

  exportPdf(){
    this.getFile().then((file:any)=>{
      if(file){
        let dia = this.dialog.open(GenericComponent,{disableClose:true, data:{msg:'Generating PDF...'}})
        this.unSelect()
        let urlserver = 'https://episjobreq.herokuapp.com/'
        this.http.post(urlserver + 'sjPdf', file, {responseType: 'blob'}).subscribe(o=>{
          const blob = new Blob([o], { type: 'application/pdf' });
          const href = document.createElement('a')
          document.body.appendChild(href)
          const url= window.URL.createObjectURL(blob)
          href.href=url
          href.download= moment(new Date()).format('YYYYMMDDHHmmss') + ' - ' + file.cliente11 + ' - ' + file.prodotto1 + ' - ' + file.matricola + '.pdf'
          href.click()
          dia.close()
          setTimeout(() => {
            window.URL.revokeObjectURL(url)
            document.body.removeChild(href)
          }, 1);
        })
        this.unSelect()
      }
    })
    

  }
  exportMa(){
    this.getFile()
    .then((file:any)=>{
      if(file){
        let dia = this.dialog.open(GenericComponent,{disableClose:true, data:{msg:'Generating PDF...'}})
        this.unSelect()
        const blob = new Blob([JSON.stringify(file)], { type: 'text/html' });
        const href = document.createElement('a')
        document.body.appendChild(href)
        const url= window.URL.createObjectURL(blob)
        href.href=url
        href.download=moment(new Date()).format('YYYYMMDDHHmmss') + ' - ' + file.cliente11 + ' - ' + file.prodotto1 + ' - ' + file.matricola + '.ma'
        href.click()
        dia.close()
        setTimeout(() => {
          window.URL.revokeObjectURL(url)
          document.body.removeChild(href)
        }, 1);
      }
      
    })
  }

  chOnline(){
    if(navigator.onLine) return true
    return false
  }

  select(e:any, a:string){
    if(!e){
      this.sjId=''
    } else {
      this.sjId=e
    }
    this.chDel=true
    if(e.substring(0,3)=='sjs') this.chDel=false
    switch(a){
      case('sent'):
        this.list1.forEach((a:any)=>{
          a.sel=0
        })
        break
      case('draft'):
        this.listSent.forEach((a:any)=>{
          a.sel=0
        })
        break
    }
  }

  syncSignature(){
    if(localStorage.getItem('Signature')==null){
      firebase.database().ref('UserSignature').child(this.userId).once('value',a=>{
        if(a.val()!=null) localStorage.setItem('Signature', a.val())
      })
    } else {
      firebase.database().ref('UserSignature').child(this.userId).set(localStorage.getItem('Signature'))
    }
  }
  
  saveSP(){
    //let source= {url: 'https://firebasestorage.googleapis.com/v0/b/epi-serv-job.appspot.com/o/Closed%2F428808%20-%2020220221%20-%20UNICALCE%20SPA%20-%20ROC%20L6(25)%20-%20AVO10A1102.pdf?alt=media&token=3a582f3e-2033-4e9a-b8ea-2f977825d11f'}
    let ref=firebase.storage().ref('Marco Arato/20220222121404 - ERDBAU S.R.L. - ROC D5-01 RRC - AVO05A788.ma')
    ref.storage

      /*let url:string='http://localhost:3001/saveOnSP'
      this.http.post(url, {url:a}).subscribe(b=>{console.log(b)})*/
  
    
  }
}

import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import firebase from 'firebase/app'
import { ActivatedRoute, ChildActivationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeldialogComponent } from '../util/dialog/deldialog/deldialog.component';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment'
import jsPDF from 'jspdf';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { strictEqual } from 'assert';
import { stringify } from 'querystring';
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
  constructor(private auth: AuthServiceService, private router:Router, private dialog: MatDialog, private http: HttpClient) { }

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
      this.checkApproval()
      this.checkDeleted()
      .then(()=>{
        this.syncDraft()
        .then(()=>{
          this.loadSJ()
          this.loadSent()
        })
      })
    } else {
      this.loadSJ()
      this.loadSent()
    }
  }

  syncDraft(){
    return new Promise((res,rej)=>{
      this.spin=true
      this.fromLocalToServer().then((a)=>{
        console.log(a)
        this.fromServerToLocal().then(b=>{
          console.log(b)
          this.spin=false
          res('ok')
        })
      })
    })
  }

  fromLocalToServer(){
    let kt:number=0
    return new Promise((res,rej)=>{
      for(let i=0; i<localStorage.length;i++){
        let k:string|null = localStorage.key(i)
        if(k?.substring(0,7)=="sjdraft"){
          let _info:string|null = localStorage.getItem(k)
          if(_info) {
            firebase.database().ref('sjDraft').child('deleted').child(k).once('value',y=>{
              if(y.val()!=null) localStorage.removeItem(k!)
            }).then(()=>{
              firebase.database().ref('sjDraft').child('sent').child(k!).once('value',y=>{
                if(y.val()!=null) localStorage.removeItem(k!)
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
      firebase.database().ref('sjDraft').child('draft').once('value',draft=>{
        if(draft.val()!=null){
          let _draft =Object.values(draft.val())
          let length:number=_draft.length
          draft.forEach(d=>{
            if(d.val()!=null && ((d.val().userId==this.userId && this.pos=='tech')|| (this.pos!='tech'))) {
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
    firebase.database().ref('sjDraft').child('sent').once('value',a=>{
      a.forEach(b=>{
        this._listSent.push(b.val())
      })
    })
    .then(()=>{
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
          console.log(JSON.parse(localStorage.getItem(localStorage.key(i)!)!))
          nuo=JSON.parse(localStorage.getItem(localStorage.key(i)!)!)
          firebase.database().ref('sjDraft').child('deleted').child(localStorage.key(i)!).set(nuo)
          .then(()=>{
            firebase.database().ref('sjDraft').child('draft').child(localStorage.key(i)!).remove()
            .then(()=>{
              localStorage.removeItem(localStorage.key(i)!)
            })
            
          })
        }
        if(i==l-1) res('ok')
      }
    })
  }

  checkApproval(){
    return new Promise((res,rej)=>{
      let l = localStorage.length
      let k:number=0
      let nuo:any
      for(let i=0;i<localStorage.length;i++){
        if(localStorage.key(i)?.substring(0,6)=="sjsent" ){
          firebase.database().ref('sjDraft').child('sent').child(localStorage.key(i)!).set(JSON.parse(localStorage.getItem(localStorage.key(i)!)!))
          .then(()=>{
            localStorage.removeItem(localStorage.key(i)!)
          })
        }
        if(i==l-1) res('ok')
      }
    })
  }

  go(){
    this.router.navigate(['newsj']) 
  }

  open(){
    this.router.navigate(['newsj', {id:this.sjId}])
  }

  chW(): boolean{
    if(window.innerWidth>850) return true
    return false
  }

  delete(){
    let del= this.sjId
    const dialogRef = this.dialog.open(DeldialogComponent, {data: {name:'Service Job draft'}})
    dialogRef.afterClosed().subscribe(res=>{
      if(res!=undefined){
        localStorage.removeItem(del)
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
    })
    this.sjId='' 
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
        this.unSelect()
        let urlserver = 'https://episjobreq.herokuapp.com/'
        this.http.post(urlserver + 'sjPdf', file, {responseType: 'blob'}).subscribe(o=>{
          const blob = new Blob([o], { type: 'file/pdf' });
          const href = document.createElement('a')
          document.body.appendChild(href)
          const url= window.URL.createObjectURL(blob)
          href.href=url
          href.download=moment(new Date()).format('YYYYMMDDHHmmss') + ' - ' + file.cliente11 + ' - ' + file.prodotto1 + ' - ' + file.matricola + '.pdf'
          href.click()
          setTimeout(() => {
            window.URL.revokeObjectURL(url)
            document.body.removeChild(href)
          }, 1);
        })
        this.sjId=''
        this.sjUrl=-1
      }
    })
    

  }
  exportMa(){
    this.getFile()
    .then((file:any)=>{
      if(file){
        this.unSelect()
        const blob = new Blob([JSON.stringify(file)], { type: 'text/html' });
        const href = document.createElement('a')
        document.body.appendChild(href)
        const url= window.URL.createObjectURL(blob)
        href.href=url
        href.download=moment(new Date()).format('YYYYMMDDHHmmss') + ' - ' + file.cliente11 + ' - ' + file.prodotto1 + ' - ' + file.matricola + '.ma'
        href.click()
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

  
  
}

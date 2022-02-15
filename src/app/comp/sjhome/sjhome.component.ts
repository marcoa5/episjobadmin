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
  sortDir:string=''
  sortDirS:string=''
  sortIcon:string='date'
  sortIconS:string='date'
  sjId:string=''
  sjUrl:number=-1
  _listSent:any=[]
  listSent:any=[]
  spin:boolean=false
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
      this.syncDraft()
      .then(()=>{
        this.loadSJ()
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
        this.fromServerToLocal()
        .then((b)=>{
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
          let info:any
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
                  kt++
                  if(kt==localStorage.length) res('ok')
                }).catch(err=>console.log('ERRORE: '+ err))
              }).catch(err=>console.log('ERRORE: '+ err))
            }).catch(err=>console.log('ERRORE: '+ err))
          }
        } else {
          kt++
          if(kt==localStorage.length) res('ok')
        }
      }
    })
  }

  fromServerToLocal(){
    let s:number=0, l:number=0, kt:number=0
    return new Promise((res,rej)=>{
      firebase.database().ref('sjDraft').child('draft').once('value',draft=>{
        let _draft =Object.values(draft.val())
        let length:number=_draft.length
        draft.forEach(d=>{
          if(d.val()!=null && ((d.val().authorId==this.userId && this.pos=='tech')|| (this.pos!='tech'))) {
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
            kt++
            if(kt==length) res('ok')
          }
        })
      })
    })
  }

  loadSJ(){
    let l = localStorage.length
    let k:number=0
    for(let i=0;i<localStorage.length;i++){
      if(localStorage.key(i)?.substring(0,7)=="sjdraft"){
        this.list.push(JSON.parse(localStorage.getItem(localStorage.key(i)!)!))
        k++     
      } else {
        k++
      }
      if(k==l) this.list1=this.list
    }
  }

  sort(a:string){
    this.sortIcon=a
    if(this.sortDir=='') {
      this.sortDir='up'
    } else if(this.sortDir=='up') {
      this.sortDir='down'
    } else {
      this.sortDir='up'
    }
    if(this.sortDir=='down'){
      this.list1.sort((a1:any,a2:any)=>{
        if (a1[a]<a2[a]) {
          return 1
        } else if (a1[a]>a2[a]){
          return -1
        } else {
          return 0
        }
      })
    } else{
      this.list1.sort((a1:any,a2:any)=>{
        if (a1[a]<a2[a]) {
          return -1
        } else if (a1[a]>a2[a]){
          return 1
        } else {
          return 0
        }
      })
    }
  }

  sel(a:string, b:number){
    if(this.list1[b].sel==0 || this.list1[b].sel==null || this.list1[b].sel==undefined){
      this.list1.forEach((e:any) => {
        e.sel=0
      });
      this.listSent.forEach((e:any) => {
        e.sel=0
      });
      this.list1[b].sel=1
      this.sjId=a
      this.sjUrl=-1
    } else {
      this.list1.forEach((e:any) => {
        e.sel=0
      });
      this.listSent.forEach((e:any) => {
        e.sel=0
      });
      this.sjId=''
      this.sjUrl=-1
    }
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
        firebase.database().ref('sjDraft').child('draft').child(del).remove()
        .then(()=>{
          firebase.database().ref('sjDraft').child('deleted').child(del).set({
            lastM: moment(new Date()).format('YYYYMMDDHHmmss'),
            status: 'deleted'
          })
        })
        this.syncDraft()
      }
    })
    this.sjId='' 
  }

  exportPdf(){
    let file:any
    let _file:any
    if(this.sjId!=''){
      _file = localStorage.getItem(this.sjId)
      if(_file) file = JSON.parse(_file)
    }
    if(this.sjUrl!=-1){
      file=this.listSent[this.sjUrl]
    }
    
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
  exportMa(){
    let file:any
    let _file:any
    if(this.sjId!=''){
      _file = localStorage.getItem(this.sjId)
      if(_file) file = JSON.parse(_file)
    }
    if(this.sjUrl!=-1){
      file=this.listSent[this.sjUrl]
    }
    
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
    this.sjId=''
    this.sjUrl=-1

  }

  chOnline(){
    if(navigator.onLine) return true
    return false
  }
  
}

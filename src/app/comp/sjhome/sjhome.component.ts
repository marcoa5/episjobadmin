import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import firebase from 'firebase/app'
import { ActivatedRoute, Router } from '@angular/router';
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
    this.syncDraft()
    
    //this.loadSent()
  }

  syncDraft(){
    let mod = localStorage.getItem('sjDraftMod')
    let _mod:any
    if(mod) _mod = JSON.parse(mod)
    if(_mod){
      Object.keys(_mod).forEach(oi=>{
        firebase.database().ref('sjDraftMod').child(this.userId).child(oi).once('value',lk=>{
          if(_mod[oi]>lk.val() || lk.val()==null) {
            console.log('local')
            let v = localStorage.getItem(oi)
            let _v
            if(v) _v=JSON.parse(v)
            if(_v) {
              firebase.database().ref('sjDraft').child(_v.userId).child(oi).set(_v)
              firebase.database().ref('sjDraftMod').child(_v.userId).child(oi).set(_mod[oi])
            }
          }
          if(_mod[oi]<lk.val()) {
            console.log('server')
            firebase.database().ref('sjDraft').child(this.userId).child(oi).once('value', a=>{
              localStorage.setItem(oi,JSON.stringify(a.val()))
              let mod = localStorage.getItem('sjDraftMod')
              let _mod:any
              if(mod) _mod = JSON.parse(mod)
              firebase.database().ref('sjDraftMod').child(this.userId).child(oi).once('value',rf=>{
                if(lk) _mod[oi]=rf.val()
              })            
              .then(()=>{
                if(_mod) localStorage.setItem('sjDraftMod',JSON.stringify(_mod))})
            })
          }
          if(_mod[oi]==lk.val()) console.log('uguale')
        })
      })
    } else{
      firebase.database().ref('sjDraft').child(this.userId).once('value',kl=>{
        kl.forEach(uh=>{
          localStorage.setItem(uh.val().sjid, JSON.stringify(uh.val()))
        })
      })
      let li:any[]=[]
      firebase.database().ref('sjDraftMod').child(this.userId).once('value',kl=>{
        kl.forEach(uh=>{
          li.push(uh.key, uh.val())
        })
      }).then(()=>{
        if(li.length>0) {
          localStorage.setItem('sjDraftMod', JSON.stringify(li))
        }
      })
    }
    if(navigator.onLine){
      
      firebase.database().ref('sjDraft').child(this.userId).on('value',m=>{
        this.list=[]
        this._list=[]
        this.list1=[]
        m.forEach(o=>{
          this.list1.push(o.val())
        })
      })
    } else {
      this.list=[]
      this._list=[]
      this.list1=[]
      for(let i=0; i<localStorage.length;i++){
        let a = localStorage.key(i)
        if(a?.substring(0,7)=='sjdraft') {
          let b:any
          if(localStorage.getItem(a)) b = localStorage.getItem(a)
          let c = JSON.parse(b)
          this._list[a]=c
        }
      }
      this.list=this._list
      let a = this._list
      this.list1 = Object.keys(a).map(o=>{
        //a[o].data_new=moment(a[o].data11).format('YYYY-MM-DD')
        a[o].sjid=o
        return a[o]
      })
      setTimeout(() => {
          Object.values(this.list).forEach((ia:any)=>{
            firebase.database().ref('sjDraft').child(this.userId).child(ia.sjid).once('value',kk=>{

            })
          })
      }, 100);
    }
  }

  loadSent(){
    firebase.database().ref('Saved').once('value',a=>{
      a.forEach(b=>{
        b.forEach(c=>{
          let gg  = c.val()
          gg['url']=b.key+'/'+c.key
          if(c.val().matricola) this._listSent.push(gg)
        })
      })
    })
    .then(()=>{this.listSent=this._listSent})
  }

  downloadDraft(){

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

  sortSent(a:string){
    this.sortIconS=a
    if(this.sortDirS=='') {
      this.sortDirS='up'
    } else if(this.sortDirS=='up') {
      this.sortDirS='down'
    } else {
      this.sortDirS='up'
    }
    if(this.sortDirS=='down'){
      this.listSent.sort((a1:any,a2:any)=>{
        if (a1[a]<a2[a]) {
          return 1
        } else if (a1[a]>a2[a]){
          return -1
        } else {
          return 0
        }
      })
    } else{
      this.listSent.sort((a1:any,a2:any)=>{
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

  sels(a:string, b:number){
    if(this.listSent[b].sel==0 || this.listSent[b].sel==null || this.listSent[b].sel==undefined){
      this.list1.forEach((e:any) => {
        e.sel=0
      });
      this.listSent.forEach((e:any) => {
        e.sel=0
      });
      this.listSent[b].sel=1
      this.sjId=''
      this.sjUrl=b
    } else {
      this.list1.forEach((e:any) => {
        e.sel=0
      });
      this.listSent.forEach((e:any) => {
        e.sel=0
      });
      this.sjUrl=-1
      this.sjId=''
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
        firebase.database().ref('sjDraft').child(this.userId).child(del).remove()
        firebase.database().ref('sjDraftMod').child(this.userId).child(del).remove()
        let v = localStorage.getItem('sjDraftMod')
        let _v
        if(v) _v=JSON.parse(v)
        delete _v[del]
        localStorage.setItem('sjDraftMod',JSON.stringify(_v))
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

  delLS(){
    //localStorage.removeItem('sjDraftMod')
    for(let i=0;i<localStorage.length-1;i++){
      let g = localStorage.key(i)
      if(g) console.log(localStorage.key(i))
    }
  }
  
}

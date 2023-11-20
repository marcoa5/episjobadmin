import { Component, Input, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import firebase from 'firebase/app'
import { MatDialog } from '@angular/material/dialog';
import { DeldialogComponent } from '../../util/dialog/deldialog/deldialog.component';
import { Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import * as moment from 'moment'
import { GenericComponent } from '../../util/dialog/generic/generic.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NotifService } from 'src/app/serv/notif.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApprovedialogComponent } from './approvedialog/approvedialog.component';
@Component({
  selector: 'episjob-jobslist',
  templateUrl: './jobslist.component.html',
  styleUrls: ['./jobslist.component.scss']
})
export class JobslistComponent implements OnInit {
  @Input() list:any[]=[]
  @Input() alreadySent:boolean=false
  @Output() select=new EventEmitter()
  @Output() directopen=new EventEmitter()
  pos:string=''
  sortedData:any[]=[]
  displayedColumns=['date','author','sn', 'customer','model']
  subsList:Subscription[]=[]
  uName:string=''
  constructor(private auth:AuthServiceService, private dialog:MatDialog, private http: HttpClient, private notif:NotifService, private snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) {
          this.pos=a.Pos
        }
      })
    )
    this.onResize()
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{
      a.unsubscribe()
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if(window.innerWidth<700){
      if (this.pos=='SU' && this.alreadySent) {
        this.displayedColumns=['date','sn','model','del','save']
      } else {
        this.displayedColumns=['date','sn','model','save']
      }
    } else {
      if (this.pos=='SU' && this.alreadySent) {
        this.displayedColumns=['date','author','sn', 'customer','model','del','save']
      } else {
        this.displayedColumns=['date','author','sn', 'customer','model']
      }
    }
  }

  ngOnChanges(){
    this.sortedData=this.list.slice()
  }

  /*sort(a:string){
    this.sortIcon=a
    if(this.sortDir=='') {
      this.sortDir='up'
    } else if(this.sortDir=='up') {
      this.sortDir='down'
    } else {
      this.sortDir='up'
    }
    if(this.sortDir=='down'){
      this.list.sort((a1:any,a2:any)=>{
        if (a1[a]<a2[a]) {
          return 1
        } else if (a1[a]>a2[a]){
          return -1
        } else {
          return 0
        }
      })
    } else{
      this.list.sort((a1:any,a2:any)=>{
        if (a1[a]<a2[a]) {
          return -1
        } else if (a1[a]>a2[a]){
          return 1
        } else {
          return 0
        }
      })
    }
  }*/

  sortData(sort: Sort) {
    const data = this.list.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date':
          return compare(a.data_new, b.data_new, isAsc);
        case 'sn':
          return compare(a.matricola, b.matricola, isAsc);
        case 'customer':
          return compare(a.cliente11, b.cliente11, isAsc);
        case 'model':
          return compare(a.prodotto1, b.prodotto1, isAsc);
        default:
          return 0;
      }
    });
  }

  sel(index:number){
    if(this.sortedData[index].sel==0 || this.sortedData[index].sel==null || this.sortedData[index].sel==undefined){
      this.sortedData.forEach((e:any) => {
        e.sel=0
      });
      this.sortedData[index].sel=1
      this.select.emit(this.sortedData[index].sjid)
    } else {
      this.sortedData.forEach((e:any) => {
        e.sel=0
      })
      this.select.emit('')
    }
  }

  directgo(id:string){
    this.directopen.emit(id)
  }

  delete(a:any){
    let id = a.sjid
    let type:string=id.substring(2,3)=='d'?'draft':'sent'
    const d = this.dialog.open(DeldialogComponent,{data:{name:'Service Job (' + a.prodotto1 + ' - ' + a.cliente11 + ')'  }})
    d.afterClosed().subscribe(res=>{
      if(res) firebase.database().ref('sjDraft').child(type).child(id).remove()
    })
  }

  chPos(pos:string){
    return this.auth.acc(pos)
  }

  save(a:any){
    let id = a.sjid
    const d = this.dialog.open(ApprovedialogComponent,{data:'Service Job (' + a.prodotto1 + ' - ' + a.cliente11 + ')'})
    d.afterClosed().subscribe(res=>{
      if(res){
        let dia = this.dialog.open(GenericComponent, {disableClose:true,data:{msg:'Saving data...'}})
        let url=environment.url
        let timeS:string|undefined
        for(let i = 1; i<8;i++){
          if(a['dat'+i+1]!=''){
            timeS=a['dat'+i+3]+a['dat'+i+2]+a['dat'+i+1]
          }
        }
        if(a.matricola!='' && a.matricola!=undefined && timeS!=undefined && timeS!=''){
          console.log('orem: ' + a.orem1,'perc1: ' + a.perc11,'perc2: '+a.perc21,'perc3: '+a.perc31)
          var data ={
            tech: a.author,
            orem: a.orem1?a.orem1.replace(/[.]/g,''):0,
            perc1: a.perc11?a.perc11.replace(/[.]/g,''):0,
            perc2: a.perc21?a.perc21.replace(/[.]/g,''):0,
            perc3: a.perc31?a.perc31.replace(/[.]/g,''):0
          }
        }
        this.http.post(url + 'sjPdfForApproval',a).subscribe((res:any)=>{
          if(res.saved){
            firebase.database().ref('Saved').child(a.matricola).child(getDaySave(a)).set(a)
            .then(()=>{
              firebase.database().ref('sjDraft').child('sent').child(a.sjid).remove()
              .then(()=>{
                if(timeS && a.matricola && data.orem>0) {
                  firebase.database().ref('Hours').child(a.matricola).child(timeS).set(data)
                  .then(()=>{
                    console.log('Hours registered')
                  })
                  .catch((err)=>{
                    console.log(err)
                  })
                } else {
                  console.log('Hours NOT registered')
                }
                this.snackBar.open('Service Job archived','',{duration:8000})

                this.getUsersForNotif().then((users:any)=>{
                  this.notif.newNotification(users,`New Service Job Archived`,`New Service Job for ${a.matricola} has been archived by ${this.uName}`, this.uName,'_sj',`./machine,{"sn":"${a.matricola}"}`)
                })
                dia.close()
              })
              .catch(()=>{this.snackBar.open('Unabel to archive Service Job','',{duration:8000})})
            })
            .catch(()=>{this.snackBar.open('Unabel to archive Service Job','',{duration:8000})})
            
          } else {
            this.snackBar.open('Unabel to archive Service Job','',{duration:8000})
            dia.close()
          }
        })
        /**/
      }
    })
  }

  getUsersForNotif(){
    let users:any[]=[]
    return new Promise((res,rej)=>{
      firebase.database().ref('Users').once('value',a=>{
        a.forEach(b=>{
          if(b.val().Pos=='SU' && b.val()._newrig=='1'){
            if(b.key) users.push(b.key)
          }
        })
      })
      .then(()=>{res(users)})
    })
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function getDaySave(a:any){
  let days:any=a.days
  let l:number=days.length
  return days[l-1].date.replace(/-/g,'') + ' - ' + a.author
}
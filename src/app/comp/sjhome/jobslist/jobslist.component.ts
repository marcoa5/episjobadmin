import { Component, Input, OnInit, Output, EventEmitter, HostListener} from '@angular/core';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import firebase from 'firebase/app'
import { MatDialog } from '@angular/material/dialog';
import { DeldialogComponent } from '../../util/dialog/deldialog/deldialog.component';
import { Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { renderFlagCheckIfStmt } from '@angular/compiler/src/render3/view/template';

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

  constructor(private auth:AuthServiceService, private dialog:MatDialog) { }

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
        this.displayedColumns=['date','sn','model','del']
      } else {
        this.displayedColumns=['date','sn','model']
      }
    } else {
      if (this.pos=='SU' && this.alreadySent) {
        this.displayedColumns=['date','author','sn', 'customer','model','del']
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
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import firebase from 'firebase/app'
import { MatDialog } from '@angular/material/dialog';
import { DeldialogComponent } from '../../util/dialog/deldialog/deldialog.component';

@Component({
  selector: 'episjob-jobslist',
  templateUrl: './jobslist.component.html',
  styleUrls: ['./jobslist.component.scss']
})
export class JobslistComponent implements OnInit {
  @Input() list:any[]=[]
  @Output() select=new EventEmitter()
  @Output() directopen=new EventEmitter()
  sortDir:string=''
  sortDirS:string=''
  sortIcon:string='date'
  sortIconS:string='date'
  constructor(private auth:AuthServiceService, private dialog:MatDialog) { }

  ngOnInit(): void {
    
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
  }

  sel(a:string, b:number){
    if(this.list[b].sel==0 || this.list[b].sel==null || this.list[b].sel==undefined){
      this.list.forEach((e:any) => {
        e.sel=0
      });
      this.list[b].sel=1
      this.select.emit(this.list[b].sjid)
    } else {
      this.list.forEach((e:any) => {
        e.sel=0
      })
      this.select.emit('')
    }
  }

  directgo(id:string,b:number){
    this.directopen.emit(id)
  }

  delete(a:any,b:number){
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

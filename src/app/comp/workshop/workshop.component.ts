import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { NewfileComponent } from './newfile/newfile.component';
import firebase from 'firebase'

@Component({
  selector: 'episjob-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.scss']
})
export class WorkshopComponent implements OnInit {
  allow:boolean=false
  pos:string=''
  subPos:string=''
  list:any[]=[]
  sortedData:any[]=[]
  displayedColumns:string[]=['file','sn','model','customer']
  subsList:Subscription[]=[]

  constructor(private auth: AuthServiceService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) {
          this.pos=a.Pos
          setTimeout(() => {
            this.allow=this.auth.allow('ws',this.pos, this.subPos)
          }, 1);
        }
      })
    )
    this.loadFiles()
  }
  
  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  loadFiles(){
    firebase.database().ref('wsFiles').child('open').on('value',a=>{
      this.list=[]
      if(a.val()!=null){
        a.forEach(b=>{
          b.forEach(c=>{
            this.list.push(c.val())
          })
        })
      }
      this.sortedData=this.list.slice()
    })
  }

  add(e:any){
    const dia=this.dialog.open(NewfileComponent,{panelClass: 'attachment',data:{new:false}})
    dia.afterClosed().subscribe(a=>{
      if(a){
        this.list.push(a)
        this.sortedData=this.list.slice()
        console.log(this.sortedData)
      }
    })
  }

  sortData(sort: Sort) {
    const data = this.list.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'sn':
          return compare(a.sn, b.sn, isAsc);
        case 'model':
          return compare(a.model, b.model, isAsc);
        case 'customer':
          return compare(a.customer, b.customer, isAsc);
        case 'file':
          return compare(a.file, b.file, isAsc);
        default:
          return 0;
      }
    });
  }

  fil(b:any){
    let e:string=b.toLowerCase()
    if(e){
      this.sortedData=this.list.filter(a=>{
        console.log(a.customer.toLowerCase().includes(e) , a.file.toLowerCase().includes(e), a.model.toLowerCase().includes(e) , a.sn.toLowerCase().includes(e))
        if(a.customer.toLowerCase().includes(e) || a.file.toLowerCase().includes(e) || a.model.toLowerCase().includes(e) || a.sn.toLowerCase().includes(e)) return a
        return false
      })
    } else {
      this.sortedData=this.list.slice()
    }

  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
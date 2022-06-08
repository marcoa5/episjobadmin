import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AttachmentdialogComponent } from 'src/app/comp/contractshome/contracts/attachmentdialog/attachmentdialog.component';
import { NewcontractComponent } from 'src/app/comp/contractshome/contracts/newcontract/newcontract.component';
import { NewcontactComponent } from 'src/app/comp/util/dialog/newcontact/newcontact.component';
import { AuthServiceService } from 'src/app/serv/auth-service.service';

@Component({
  selector: 'episjob-rigcontract',
  templateUrl: './rigcontract.component.html',
  styleUrls: ['./rigcontract.component.scss']
})
export class RigcontractComponent implements OnInit {
  @Input() list:any
  displayedColumns:string[]=['type','expdate','attach']
  _list:any[]=[]
  inizio: number = 0
  fine: number = 5
  pos:string=''
  subsList:Subscription[]=[]

  constructor(private dialog:MatDialog, private auth: AuthServiceService) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) this.pos=a.Pos
      })
    )
  }

  ngOnChanges(){
    this._list=this.list.slice()
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  open(info:any, i:number){
    let read:boolean=(this.auth.acc('AdminRights'))?false:true
    const dia = this.dialog.open(NewcontractComponent,{data:{info:info, new:false, read:read}})
  }

  split(e:any){
    this.inizio = e.pageIndex * e.pageSize
    this.fine = this.inizio + e.pageSize
    this._list = this.list.slice(this.inizio,this.fine)
  }

  att(info:any, list:any){
    const dia = this.dialog.open(AttachmentdialogComponent,{panelClass: 'attachment', data:{info:info,list:list}})
  }

}

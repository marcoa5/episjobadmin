import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router'
import firebase from 'firebase/app'
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { MakeidService } from 'src/app/serv/makeid.service';
import { NewcontactComponent } from '../util/dialog/newcontact/newcontact.component';
import { NewcontactcustomerselectionComponent } from './newcontactcustomerselection/newcontactcustomerselection.component';
import { ExportContactsService } from 'src/app/serv/export-contacts.service';
import { ExcelService } from 'src/app/serv/excelexport.service'
import * as XLSX from 'xlsx-js-style'
import { GenericComponent } from '../util/dialog/generic/generic.component';
import { MessageComponent } from '../util/dialog/message/message.component';
@Component({
  selector: 'episjob-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  contacts:any[]=[]
  filtro:string=''
  pos:string=''
  allow:boolean=false
  allSpin:boolean=true
  customers:any[]=[]
  alfaLow:string[]=[]
  alfaUp:string[]=[]
  sortBut:boolean=true
  sortBy:string='name'
  nameAsc:boolean=true
  surnameAsc:boolean=true
  val:any
  subsList:Subscription[]=[]

  constructor(private excel:ExcelService, private eCon:ExportContactsService, public dialog: MatDialog, public route: ActivatedRoute, public auth: AuthServiceService, private makeid: MakeidService) { 
    auth.getContact()
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if(window.innerWidth<700){
      this.sortBut=false
      this.sortList(this.sortBy)
    }else{
      this.sortBut=true
    }
  }

  ngOnInit(): void {
    this.onResize()
    this.alfaLow='abcdefghijklmnopqrstuvwxyz'.split('')
    this.alfaUp=this.alfaLow.map(l=>l.toUpperCase())
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
        setTimeout(() => {
          this.allow=this.auth.allow('Internal',this.pos)
        }, 1);
      }),
      this.auth._customers.subscribe(a=>{
        if(a) this.customers=a
      }),
      this.auth._contacts.subscribe((a:any[])=>{
        this.contacts=a
        this.sortList(this.sortBy)
        if(a.length>0){
          let length:number=a.length
          let index:number=0
          a.forEach(e => {
            firebase.database().ref('CustomerC').child(e.id).once('value',b=>{
              e['company'] = b.val().c1
            }).then(()=>{
              index++
              if(index==length) this.allSpin=false
            })
          });
        }
        setTimeout(() => {
          this.allSpin=false
        }, 10000);
      })
    )
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  filter(a:any){
    this.filtro=a
  }

  go(c:any){
    const dialogRef = this.dialog.open(NewcontactComponent, {data: {info:c}})
    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined) {
        let old=this.filtro
        this.filtro=''
        setTimeout(() => {
          this.filtro=old
        }, 0.1);
      }
    })
  }

  sortList(value:any){
    if(value=='name') this.nameAsc=!this.nameAsc
    if(value=='surname') this.surnameAsc=!this.surnameAsc
    this.sortBy=value
    let val:number=0
    switch(value){
      case 'name':
        this.nameAsc?val=1:val=-1
        break
      case 'surname':
        this.surnameAsc?val=1:val=-1
        break
    }
    this.contacts.sort((b:any,c:any)=>{
      if(b[value].toLowerCase()>c[value].toLowerCase()) return val
      if(b[value].toLowerCase()<c[value].toLowerCase()) return -val
      return 0
    })
  }

  addNew(e:any){
    let dia=this.dialog.open(NewcontactcustomerselectionComponent,{panelClass: 'custselect', data:''})
    dia.afterClosed().subscribe(res=>{
      if(res){
        let info:any = this.customers[this.customers.map(a=>{return a.id}).indexOf(res.id)]
        let d = this.dialog.open(NewcontactComponent, {data: {id: info.id, type: 'new'}})
      }
    })
    
  }

  exportContacts(){
    const d = this.dialog.open(GenericComponent, {disableClose:true,data:{msg:'Collecting data'}})
    setTimeout(() => {
      d.close()
    }, 10000);
    this.eCon.export(this.customers)
    .then((list:any)=>{
      if(list==''){
        d.close()
        this.dialog.open(MessageComponent, {data:{title:'Error',msg:'No data'}})
      } else {
        let name='Contacts List'
        let cols:string[]=['Id','CustomerId','Phone']
        let colWidth:any[]=[120,120,120,220,150,220,150,220]
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(list)
        let range=XLSX.utils.decode_range(worksheet['!ref']!)
        let Sheets:any={}
        Sheets[name]=worksheet
        const workbook: XLSX.WorkBook = { 
          Sheets, 
          SheetNames: [name] 
        }
        this.excel.exportAsExcelFile(workbook,name,cols,colWidth)
        d.close()
      }
    })
  }
  
}

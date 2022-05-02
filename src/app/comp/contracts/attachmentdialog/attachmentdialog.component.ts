import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import firebase from 'firebase/app'
import { generate, Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { DeldialogComponent } from '../../util/dialog/deldialog/deldialog.component';
import { GenericComponent } from '../../util/dialog/generic/generic.component';
import { AttachalreadyexistsComponent } from '../attachalreadyexists/attachalreadyexists.component';
@Component({
  selector: 'episjob-attachmentdialog',
  templateUrl: './attachmentdialog.component.html',
  styleUrls: ['./attachmentdialog.component.scss']
})
export class AttachmentdialogComponent implements OnInit {
  attachmentExists:boolean|undefined
  contractList:any[]=[]
  pos:string=''
  subsList:Subscription[]=[]
  constructor(private auth:AuthServiceService, public dialog:MatDialog, public dialogRef:MatDialogRef<AttachmentdialogComponent>, @Inject(MAT_DIALOG_DATA) public data:any ) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a){
          this.pos=a.Pos
        }
      })
    )
    if(this.data.list!='new'){
      this.data.list.forEach((a:any)=>{
        this.contractList.push({name:a.name,path:a.fullPath,ico:a.name.split('.').slice(-1).toString()})
      })
    }
    
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
    firebase.database().ref('Contracts').child(this.data.info.sn).child(this.data.info.type).child(this.data.info.id).child('att').set(this.contractList.length)
  }

  onNoClick(){
    this.dialogRef.close()
  }

  open(path:string){
    console.log(path)
    let sp:string[]=path.split('/')
    //return
    const dia=this.dialog.open(GenericComponent,{data:{msg:'Loading...'}})
    setTimeout(() => {
      dia.close()
    }, 10000);
    let ref = firebase.storage().ref(sp[0]).child(sp[1]).child(sp[2])
    //ref.getMetadata().then(data=>{})
    ref.getDownloadURL()
    .then(url=>{
      window.open(url)
    })
    .catch(err=>{console.log(err)})
    .finally(()=>{dia.close()})
  }

  async fileUpload(e:any){
    let a:File[] = e.target.files
    for(let i =0;i<a.length;i++){
      
      const r= this.dialog.open(GenericComponent,{data:{msg:'Loading "'+ a[i].name+'"...'}})
        setTimeout(() => {
          r.close()
        }, 10000);
      let ref = firebase.storage().ref('Contracts').child(this.data.info.id).child(a[i].name)
      await ref.getDownloadURL()
      .then(async (url)=>{
        const dia=this.dialog.open(AttachalreadyexistsComponent,{data:a[i].name})
        await dia.afterClosed().toPromise().then(res=>{
          if(res) {
            a[i].arrayBuffer().then(file=>{
              ref.put(file).then(()=>{
                r.close()
              })
            })
          }
        })
      })
      .catch(()=>{
        ref.put(a[i]).then(()=>{
          this.contractList.push({name:a[i].name,path:'Contracts/' + this.data.info.id +'/'+ a[i].name,ico:a[i].name.split('.').slice(-1).toString()})
          r.close()
        })
      })
    }
  }

  delete(a:string, b:string, i:number){
    const dia=this.dialog.open(DeldialogComponent,{data:{desc:'"' + b + '"',id:'ok'}})
    dia.afterClosed().subscribe(res=>{
      if(res) {
        const r= this.dialog.open(GenericComponent,{data:{msg:'Deleting item...'}})
        setTimeout(() => {
          r.close()
        }, 10000);
        firebase.storage().ref(a).delete()
        .then(()=>{
          this.contractList.splice(i,1)
          r.close()
        })
      }
    })
  }
}

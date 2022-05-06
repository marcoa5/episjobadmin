import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { NewfileComponent } from './newfile/newfile.component';

@Component({
  selector: 'episjob-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.scss']
})
export class WorkshopComponent implements OnInit {
  allow:boolean=false
  pos:string=''
  subsList:Subscription[]=[]

  constructor(private auth: AuthServiceService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) {
          this.pos=a.Pos
          setTimeout(() => {
            this.allow=this.auth.allow('workshop',this.pos)
          }, 1);
        }
      })
    )
  }
  
  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  add(e:any){
    const dia=this.dialog.open(NewfileComponent,{panelClass: 'attachment',data:{new:false}})
  }

}

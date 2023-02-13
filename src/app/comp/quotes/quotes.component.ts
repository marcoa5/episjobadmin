import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { NewquoteComponent } from './newquote/newquote.component';

@Component({
  selector: 'episjob-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss']
})
export class QuotesComponent implements OnInit {
  allow:boolean=false
  subsList:Subscription[]=[]
  pos:string=''
  constructor(private auth:AuthServiceService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        if(a) this.pos=a.Pos
        setTimeout(() => {
          this.allow=this.auth.allow('Admin',this.pos)
        }, 1);
      })
    )
  }

  addNew(){
    let d = this.dialog.open(NewquoteComponent, {panelClass: 'custselect'})
    d.afterClosed().subscribe(res=>{
      console.log(res)
      alert('Under Construction')
    })
  }

}

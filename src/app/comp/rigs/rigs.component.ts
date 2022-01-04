import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/serv/auth-service.service';
import { BackService } from '../../serv/back.service'


@Component({
  selector: 'episjob-rigs',
  templateUrl: './rigs.component.html',
  styleUrls: ['./rigs.component.scss']
})
export class RigsComponent implements OnInit {
  rigs:any[] =[];
  rigs1:any[] =[];
  cat:any
  oldPosition:number=0;
  currentPosition:number=0;
  scrollaV:boolean =true;
  filtro:string=''
  lar:boolean|undefined;
  value:any
  pos:string|undefined
  iniz:string|undefined
  auth:any[]=[]
  constructor(public router: Router, public bak:BackService, auth: AuthServiceService) { 
    auth._fleet.subscribe(a=>this.rigs1=a)
   }

  ngOnInit(): void {
    this.largh(1)
    
  }

  imageExists(url: string, callback: (arg0: boolean) => void) {
    var img = new Image();
    img.onerror = function() { callback(false); };
    img.onload = function() { callback(true); };
    img.src = url;
  }

  back(){
    this.bak.backP()
  }

  open(a: String, b:String, c:String, d:any){
    if(d=='0') {
      console.log('disabled')
    } else{
      this.router.navigate(['machine',{sn:b}])
    }
  }

  scrolla(e:Event){
    
    this.currentPosition = window.pageYOffset
    if(this.currentPosition>this.oldPosition){
      this.scrollaV = false
    } else {
      this.scrollaV = true
    }
    this.oldPosition = this.currentPosition
  }

  scrivi(e: any){
    this.filtro=e.target.value.toString()
  }

  largh(e:any){
    if(window.innerWidth>500) {
      this.lar = true
    } else {
      this.lar=false
    }      
  }

  cancella(){
    this.value=''
    this.filtro=''
  }
  
  filter(a:any){
    this.filtro=a
  }


}

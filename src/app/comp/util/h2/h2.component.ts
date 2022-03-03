import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, QueryList } from '@angular/core';
import firebase from 'firebase/app';
import { Subscriber, Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/serv/auth-service.service';

@Component({
  selector: 'episjob-h2',
  templateUrl: './h2.component.html',
  styleUrls: ['./h2.component.scss']
})
export class H2Component implements OnInit {
  @Input() data:string|undefined
  @Input() padtop:any=35
  @Input() showAdd:boolean= false
  @Input() showMol:boolean=false
  @Input() showDL:boolean=false
  @Input() showSort:boolean=false
  @Input() showSearch:boolean=false
  @Input() showLimit:boolean=false
  @Input() icon:string=''
  @Input() limitLabel:string=''
  @Output() addCD = new EventEmitter()
  @Output() mol = new EventEmitter()
  @Output() copy = new EventEmitter()
  @Output() sort = new EventEmitter()
  @Output() filter =new EventEmitter()
  @Output() limit = new EventEmitter()
  subsList:Subscription[]=[]
  pos:string=''
  
  constructor(private auth: AuthServiceService) { }

  ngOnInit(): void {
    this.subsList.push(
      this.auth._userData.subscribe(a=>{
        this.pos=a.Pos
      })
    )
  }

  ngOnDestroy(){
    this.subsList.forEach(a=>{a.unsubscribe()})
  }

  add(e:any){
    this.addCD.emit('ok')
  }

  openMol(){
    this.mol.emit('mol')
  }

  copyData(){
    this.copy.emit('copy')
  }

  sortData(){
    this.sort.emit('sort')
  }

  fil(e:any){
    this.filter.emit(e.target.value)
  }

  lim(e:any){
    this.limit.emit(e.target.value)
  }
}

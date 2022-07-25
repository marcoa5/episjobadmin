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
  @Input() addSubEq:boolean=false
  @Input() addGeneral:boolean=false
  @Input() showChBox:boolean=false
  @Input() dlTooltip:string = 'Copy Data'
  @Output() addCD = new EventEmitter()
  @Output() mol = new EventEmitter()
  @Output() copy = new EventEmitter()
  @Output() sort = new EventEmitter()
  @Output() filter =new EventEmitter()
  @Output() limit = new EventEmitter()
  @Output() addSub = new EventEmitter()
  @Output() down=new EventEmitter()
  @Output() checkBox=new EventEmitter()
  @Output() addGen=new EventEmitter()
  @ViewChild('chec') chec!:ElementRef
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

  addS(e:any){
    this.addSub.emit('addSub')
  }

  addG(e:any){
    this.addGen.emit('add')
  }

  lim(e:any){
    this.limit.emit(e)
  }

  download(){
    this.down.emit('d')
  }

  ch(e:any){
    this.checkBox.emit(this.chec.nativeElement.checked)
  }

  width(){
    if(window.innerWidth>500) return true
    return false 
  }

  chPos(a:string){
    return this.auth.acc(a)
  }
}

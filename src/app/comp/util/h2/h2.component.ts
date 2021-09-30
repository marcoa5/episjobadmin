import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import firebase from 'firebase/app';

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
  @Input() icon:string=''
  @Output() addCD = new EventEmitter()
  @Output() mol = new EventEmitter()
  @Output() copy = new EventEmitter()

  pos:string=''
  constructor() { }

  ngOnInit(): void {
    firebase.auth().onAuthStateChanged(a=>{
      if(a) {
        firebase.database().ref('Users').child(a.uid).once('value',b=>{
          this.pos=b.val().Pos
        })
      }
    })
  }

  add(){
    this.addCD.emit('ok')
  }

  openMol(){
    this.mol.emit('mol')
  }

  copyData(){
    this.copy.emit('copy')
  }
}

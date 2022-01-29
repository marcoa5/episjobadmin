import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';

@Component({
  selector: 'episjob-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss']
})
export class SignComponent implements OnInit {
  @ViewChild(SignaturePad) signaturePad!: SignaturePad;
  signatureImg:string=''
  signaturePadOptions: Object = { 
    'minWidth': 2,
    'canvasWidth': 700,
    'canvasHeight': 300
  };
  @Input() sign:any
  @Input() tc:string=''
  @Output() closeS=new EventEmitter()
  isValid:boolean=false

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.resizeSignaturePad()
    this.signaturePad.set('minWidth', 2); 
    this.signaturePad.clear(); 
    this.drawSign()
    }
  
  drawSign(a?:number,b?:number){
    if(this.sign!='') {
      var canvas = this.signaturePad.queryPad()._canvas
      var ctx = canvas.getContext("2d");
      var image = new Image()
      image.src=this.sign
      if(a && b) {
        ctx.drawImage(image,0,0, a,b)
      } else {
        ctx.drawImage(image,0,0)

      }

      
    }
  }

  resizeSignaturePad(){
    this.signaturePad.clear(); 
    let a = window.innerWidth*.9
    if(a/2.3 < window.innerHeight - 70){
      this.drawSign(a,a/2.3)
      this.signaturePad.queryPad()._canvas.width=a
      this.signaturePad.queryPad()._canvas.height=a/2.3
    } else {
      let b= window.innerHeight-70
      this.drawSign(b,b*2.3)
      this.signaturePad.queryPad()._canvas.height=b
      this.signaturePad.queryPad()._canvas.width=b*2.3
    }
  }

  drawComplete() {
    this.sign=this.signaturePad.toDataURL()
  }

  drawStart() {
    this.isValid=true
  }

  clearSignature() {
    this.signaturePad.clear();
    this.isValid=false
  }

  savePad() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
  }
  close(){
    this.closeS.emit('close')
  }

  save(){
    this.closeS.emit([this.tc, this.signaturePad.toDataURL()])
  }
}
import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
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
  @Output() closeS=new EventEmitter()
  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.resizeSignaturePad()
    this.signaturePad.set('minWidth', 2); 
    this.signaturePad.clear(); 
  }
  


  resizeSignaturePad(){
    let a = window.innerWidth*.9
    if(a/2.3 < window.innerHeight - 70){
      this.signaturePad.queryPad()._canvas.width=a
      this.signaturePad.queryPad()._canvas.height=a/2.3
    } else {
      let b= window.innerHeight-70
      this.signaturePad.queryPad()._canvas.height=b
      this.signaturePad.queryPad()._canvas.width=b*2.3
    }
    
    var canvas = this.signaturePad.queryPad()._canvas
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "blue";
  }
  drawComplete() {
    
  }

  drawStart() {
    
  }

  clearSignature() {
    this.signaturePad.clear();
  }

  savePad() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
  }
  close(){
    this.closeS.emit('close')
  }

  save(){
    this.closeS.emit(this.signaturePad.toDataURL())
  }
}
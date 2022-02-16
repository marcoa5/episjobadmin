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
    if(this.sign!='') this.isValid=true
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.resizeSignaturePad()
    this.signaturePad.set('minWidth', 2); 
    this.signaturePad.clear(); 
    this.drawSign()
    }
  
  drawSign(){
    var canvas = this.signaturePad.queryPad()._canvas
    var ctx = canvas.getContext("2d");
    var image = new Image()
    image.src=this.sign
    if(image) ctx.drawImage(image,0,0, canvas.width, canvas.height) 
  }

  drawOri(){
    var canvas = this.signaturePad.queryPad()._canvas
    var ctx = canvas.getContext("2d");
    var image = new Image()
    image.src=this.sign
    if(image) ctx.drawImage(image,0,0, canvas.width, canvas.height) 
  }

  resizeSignaturePad(){
    let w = window.innerWidth*.9
    let h = window.innerWidth*.9/2.3
    this.signaturePad.queryPad()._canvas.width=w
    this.signaturePad.queryPad()._canvas.height=h
    this.drawSign()
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
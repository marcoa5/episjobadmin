import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import firebase from 'firebase'
import 'firebase/database'

@Component({
  selector: 'episjob-newrig',
  templateUrl: './newrig.component.html',
  styleUrls: ['./newrig.component.scss']
})
export class NewrigComponent implements OnInit {
  serial:string=''
  rou:any[]=[]
  rig: string[]|undefined
  constructor(private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(a=>{
      this.serial= a.name
      this.rou=['machine',{sn: this.serial}]
      firebase.database().ref('MOL/' + this.serial).on('value',a=>{
        this.rig=a.val()
        console.log(this.rig)
      })
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackService } from '../../serv/back.service'

@Component({
  selector: 'episjob-rigs',
  templateUrl: './rigs.component.html',
  styleUrls: ['./rigs.component.scss']
})
export class RigsComponent implements OnInit {

  constructor(public router: Router, public bak:BackService) { }

  ngOnInit(): void {
  }

  back(){
    this.bak.backP()
  }

}

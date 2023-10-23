import { Component, Input, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {

  @Input() firebase!:FirebaseService;
  @Output() eventChoice = new EventEmitter<string>();
  public spinner:boolean=false;
  constructor() { }

  ngOnInit() {
  }

  async goToThings(value:string)
  {
    this.eventChoice.emit(value);
  }

}

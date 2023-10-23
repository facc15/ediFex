import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private platform: Platform,private router: Router) {
    this.initializeApp();
  }

  public async initializeApp()
  {
    this.platform.ready().then(()=>{

        this.router.navigateByUrl('splash-screen');

    });
  }
}

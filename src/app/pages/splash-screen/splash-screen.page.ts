import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SplashScreen} from '@capacitor/splash-screen';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.page.html',
  styleUrls: ['./splash-screen.page.scss'],
})
export class SplashScreenPage implements OnInit {

  constructor(private router: Router) { }
  ionViewDidEnter()
  {
    SplashScreen.hide();
  }
  ngOnInit() {
    setTimeout(() => {
      this.router.navigateByUrl('login');
    },3000);
  }



}

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Photo } from 'src/app/interfaces/photo';
import { FirebaseService } from 'src/app/services/firebase.service';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, AfterViewInit {

  public spinner:boolean=false;
  public list:boolean=false;
  public chartOn:boolean=false;
  public value!:string;
  public chart!:string;
  public photos:Photo[];



  constructor(public firebase:FirebaseService,private router:Router) { }

  async ngOnInit() {
    this.spinner=true;

    await this.firebase.firestoreService.getPhotos();
    await this.firebase.firestoreService.getUsers();

  }
  ngAfterViewInit()
  {
    setTimeout(() => {
      this.spinner=false;
    }, 1000);

    this.firebase.firestoreService.listPhotos.subscribe((photos:Photo[])=>{

      this.photos=photos;


    });
  }

  seeChart(value:string)
  {

    if(value=='pretty')
    {
      this.chart='pie';
    }else if(value=='ugly')
    {
      this.chart= 'column';
    }


    this.chartOn = !this.chartOn;

  }

  seePhotos()
  {
    this.chartOn=!this.chartOn;
  }

  userLogout()
  {

    this.spinner=true;

    this.firebase.logout().then(()=>{

      setTimeout(() => {

        this.spinner=false;
        this.router.navigateByUrl('login');
      }, 1500);


    })
  }

  async chosenOption(value:string)
  {
    this.spinner=true;
    this.value=value;

    await this.firebase.firestoreService.getPhotos(this.value).then(()=>{

      setTimeout(() => {
        this.spinner=false;
        this.list=true;

    },8000);
    });


  }



}

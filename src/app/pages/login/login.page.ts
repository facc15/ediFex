import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public form: FormGroup;
  public user: User;
  public spinner:boolean=false;
  constructor(private router: Router,private auth:FirebaseService) {


    this.form = new FormGroup({
      email: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',[Validators.required, Validators.minLength(6)])
    });

    this.user ={uid:{},email:{},pass:{},profile:{}} as User;
  }
  

  async ngOnInit() {
    await this.auth.firestoreService.getPhotos();
    await this.auth.firestoreService.getUsers();
  }

  cargarForm(email:string,pass:string)
  {
      this.form.get('email')?.setValue(email);
      this.form.get('password')?.setValue(pass);
   
  }
  login(form : FormGroup)
  {
    this.spinner=true;
    this.user.email=form.controls['email'].value;
    this.user.pass=form.controls['password'].value; 
    console.log(this.user.email);
    console.log(this.user.pass);

    this.auth.logUser(this.user).then(()=>{

      setTimeout(() => {

        this.spinner=false;
        this.router.navigateByUrl('dashboard'); 
      }, 1000);

    });

  }

}

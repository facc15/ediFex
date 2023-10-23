import { Injectable, OnInit } from '@angular/core';

import {User} from '../interfaces/user';
import { Auth, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';
import { ToastController } from '@ionic/angular';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnInit {
  app: any;
  db:any;
  userLog: User;

  ngOnInit()
  {

  }

  constructor(private auth: Auth, public firestoreService:FirestoreService, private toastCtrl: ToastController) 
  {


    this.userLog ={uid:{},email:{},pass:{},profile:{}} as User;
  }

  async logUser(user: User)
  {
    console.log(this.firestoreService.users);
    
    await signInWithEmailAndPassword(this.auth,user.email,user.pass).then(async(userCredential)=>{
  
      const userAuth = userCredential.user;
      console.log("Usuario logueado-> "+userAuth.email);
      this.firestoreService.users.forEach(userFirestore => {
       
          if(userFirestore.uid==userAuth.uid)
          {
            this.userLog=userFirestore;
            this.firestoreService.userLog=this.userLog;

            console.log("Usuario firestoreado-> "+this.userLog.email);
          }
      });

    }).catch((error)=>{console.log(error);});

  }

  async openToast(message:string,color:string) {  
    const toast = await this.toastCtrl.create({  
      message: message,  
      duration: 4000,
      position: 'top',
      color: color,
      cssClass: 'miToast'
    });  
    await toast.present();  
  } 

  async logout(){
    const auth = getAuth();
    try{

      await signOut(auth);
    }catch(error){
          console.log(error);
    }

  }


  async addUser(user: User)
  {
    /*
    await createUserWithEmailAndPassword(this.auth, user.email, user.pass).then(async (userCredential) => {
      const userF = userCredential.user;
      console.log("registrado con exito->"+userCredential.user.email);
      this.toastr.success("El usuario se registró satisfactoriamente!!!","Éxito",{
        timeOut: 1000,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-center'
        });
        user.uid=userF.uid;
        this.firestore.addCollectionUser(user);

      }).catch(async error => {
        console.log("error->"+error);
        
        this.toastr.error(this.firebaseError(error.code),'Error',{
          timeOut: 1200,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-center'});
        });

      });*/
    }

}

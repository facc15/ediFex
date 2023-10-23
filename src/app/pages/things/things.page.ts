import { Component, Input, OnInit } from '@angular/core';
import { Photo } from 'src/app/interfaces/photo';
import { DateService } from 'src/app/services/date.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Camera, CameraResultType, CameraSource, ImageOptions } from '@capacitor/camera';
import { Filesystem} from '@capacitor/filesystem';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-things',
  templateUrl: './things.page.html',
  styleUrls: ['./things.page.scss'],
})

export class ThingsPage implements OnInit{

  public file:any;
  public uidLikes:string[]=[];
  public photos:Photo[];
  public photo:Photo;
  public path!:string|undefined;
  public spinner:boolean=false;

@Input() firebase!:FirebaseService;
@Input() value!:string;
  constructor(private date:DateService) {
    this.photo ={uid:"",uidUser:"",url:"",name:"",likes:0,userLiked:false,uidLikes:{},value:"",date:{}} as Photo;
    this.photos =[];

  }


ngOnInit(){
  this.firebase.firestoreService.listPhotos.subscribe((photos:Photo[])=>{

    this.photos=photos;

  });

}



  //Camera
  async takePhoto()
  {
    await Camera.requestPermissions().then(async ()=>{


        this.spinner=true;

      const image = await Camera.getPhoto({
        quality: 50,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        width:100,
        height:90,
      });
      // image.webPath will contain a path that can be set as an image src.
      // You can access the original file using image.path, which can be
      // passed to the Filesystem API to read the raw data of the image,
      // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
      this.path=image.base64String;
      // Can be set to the src of an image now
      //imageElement.src = imageUrl;
      await this.savePhoto(this.path).then(()=>{

        setTimeout(() => {
          this.spinner=false;
          this.firebase.openToast('Se subio la foto correctamente','success');
        }, 8000);
      });
    });

  }

  async savePhoto(photo?:any)
  {
    const date=this.date.getToday();

    if(photo)
    this.photo.url=photo;

    this.photo.uid=this.getRandomString(17);
    this.photo.uidUser=this.firebase.userLog.uid;
    this.photo.value=this.value;
    this.photo.date=date;
    this.photo.uidLikes= this.uidLikes;
    this.photo.name=this.firebase.userLog.profile;


    await this.firebase.firestoreService.addPhoto(this.photo,photo).then(async()=>{

      await this.firebase.firestoreService.getPhotos(this.value);

    });




  }



  getRandomString(lenght: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < lenght; i++) {
      const index = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(index);
    }

    return randomString;
  }


  deleteLike(array: string[], elemento: string)
  {
      return array.filter(item => item !== elemento);
  }

  // Verificar si hay elementos repetidos basados en la fecha



  async likePhoto(photo:Photo)
  {
    if(photo.userLiked)
    {
      photo.likes--;
      const newArray=this.deleteLike(photo.uidLikes,this.firebase.userLog.uid);
      photo.uidLikes=newArray;
    }else
    {
      photo.likes++;
      photo.uidLikes.push(this.firebase.userLog.uid);
    }

    photo.userLiked = !photo.userLiked;

      await this.firebase.firestoreService.addPhoto(photo).then(()=>{

      });

  }


  checkLike(photo:Photo):boolean
  {
    var resp=false;

    for (const uid of photo.uidLikes)
    {
      if(uid ==this.firebase.userLog.uid)
      {

        resp=true;

      }
    }

   return resp;
  }


  upPhoto(event:any)
  {
    this.file = event.target.files[0];
    console.log(this.file);
  }

}

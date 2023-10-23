import { Injectable } from '@angular/core';
import { Storage,ref,uploadBytes ,listAll,getDownloadURL, uploadString } from '@angular/fire/storage';
import { Photo } from '../interfaces/photo';
import { FirestoreService } from './firestore.service';
import { StoragePhotos} from '../interfaces/storage-photos';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  public photos:Photo[];

  constructor(private storage: Storage) {

    this.photos=[];
   }

  async up(value:any,uid:string)
  {
    const imgRef= ref(this.storage,"Fotos/"+uid+".jpeg")

    const metadata = {
      contentType: 'image/jpeg',
    };

    await uploadString(imgRef, value, 'base64', {
        contentType: 'image/jpeg', // <-- replace with file's type
      }).then(() => {
        console.log('Image Uploaded');
      });



  }

  async getPhotos(photos:Photo[]):Promise<Photo[]>
  {
    this.photos=[];
    const imgRef= ref(this.storage,"Fotos/");

    await listAll(imgRef)
    .then(async response=>{
      console.log(response);
      for (let item of response.items)
      {
       const url=await getDownloadURL(item);

       const name = item.name.split(".");

       for (const photo of photos)
       {

        if(!this.photos.includes(photo))
        {
          if(photo.uid==name[0])
          {
            photo.url=url;

            this.photos.push(photo);
            break;
          }
        }
       }

      }
    })
    .catch(err=>console.log(err));

    return this.photos;
  }


}

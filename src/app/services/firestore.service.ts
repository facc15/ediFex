import { Injectable, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { doc, getFirestore, onSnapshot, query, setDoc, where } from '@angular/fire/firestore';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Photo } from '../interfaces/photo';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService implements OnInit {

  public users: User[];
  public userLog!: User;
  public photos: Photo[];
  private listSubject = new BehaviorSubject<Photo[]>([]);
  public listPhotos: Observable<Photo[]> = this.listSubject.asObservable();

  constructor(private firestore:Firestore,private storage: StorageService)
  {
    this.users=[];
    this.photos=[];
  }
  async ngOnInit()
  {
  }

  updateList(newList: Photo[])
  {

    this.listSubject.next(newList);
  }

  sortByDate(p1: Photo, p2: Photo)
  {
  const dateA = new Date(`${p1.date.year}-${p1.date.month}-${p1.date.day}T${p1.date.fullHour.hour}:${p1.date.fullHour.minute}`);
  const dateB = new Date(`${p2.date.year}-${p2.date.month}-${p2.date.day}T${p2.date.fullHour.hour}:${p2.date.fullHour.minute}`);

  if (dateA > dateB) return -1;
  if (dateA < dateB) return 1;

  return 0;

  }

  checkLikes(photos:Photo[]):Photo[]
  {
    this.photos=[];
    for (const photo of photos)
    {
        for (const like of photo.uidLikes)
        {
          if(like==this.userLog.uid)
            photo.userLiked=true;
        }
        this.photos.push(photo);
    }

    return this.photos;
  }

  deleteElementRepeat(duplicatesPhotos: Photo[]): Photo[] {

    const idsUnicos = new Set();
    const miArraySinDuplicados = duplicatesPhotos.filter(photo => {
  if (!idsUnicos.has(photo.uid)) {
    idsUnicos.add(photo.uid);
    return true;
  }
  return false;
});

return miArraySinDuplicados;
  }

  async getPhotos(value?:string)
  {
    const photos:Photo[]=[];

    if(value)
    {
      const q = await query(collection(this.firestore, "Fotos"), where("value", "==", value));

      const unsubscribe = await onSnapshot(q, async (snapshot) => {
          snapshot.forEach((doc) => {
            const photo=<Photo>doc.data();
            if(!photos.includes(photo))
            photos.push(photo);

        });

      const photosWithimage=await this.storage.getPhotos(photos);
      const checkedPhotos=this.checkLikes(photosWithimage);
      const sortedPhotos=checkedPhotos.sort(this.sortByDate);
      const photosWithOutDuplicated= this.deleteElementRepeat(sortedPhotos);
      console.log("Lista ordenada y likeada->");
      console.log(photosWithOutDuplicated);
      this.updateList(photosWithOutDuplicated);
      });
    }else
    {
      const querySnapshot = await getDocs(collection(this.firestore, "Fotos"));

      querySnapshot.forEach((doc) => {

       this.photos.push(<Photo>doc.data());
      this.updateList(this.photos);
     });



    }

  }


  async addPhoto(photo:Photo,value?:any)
  {
    try
    {

      const collectionRef = doc(this.firestore, 'Fotos',photo.uid);
      console.log(collectionRef);

        await setDoc(collectionRef, {
          uid:photo.uid,
          uidUser: photo.uidUser,
          url: photo.url,
          name: photo.name,
          likes: photo.uidLikes.length,
          uidLikes: photo.uidLikes,
          date: photo.date,
          value:photo.value
        }, { merge: true });

        if(value)
        {
         await this.storage.up(value,photo.uid);

        }

      }catch (e)
      {
        console.error("Error adding document: ", e);
        //this.getPhotos(photo.value);
      }
  }

  async getUsers()
  {
    const querySnapshot = await getDocs(collection(this.firestore, "Usuarios"));

     querySnapshot.forEach(async (doc) => {
      // doc.data() is never undefined for query doc snapshots
      this.users.push(<User>doc.data());
    });
  }
/*
  async addCollectionUser(user:User)
  {

  try {

    const collectionRef = doc(this.firestore, 'Usuarios',user.uid);
    console.log(collectionRef);

    await setDoc(collectionRef, {
      uid:user.uid,
      email: user.email,
      pass: user.pass,
      fecha: new Date()
    }, { merge: true });
    } catch (e) {
    console.error("Error adding document: ", e);
  }
  }
*/
}

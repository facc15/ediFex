import { DatePhoto } from 'src/app/interfaces/date';
import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  private datePhoto: DatePhoto;
  constructor() { 
    
    this.datePhoto ={day:{},month:{},year:{},fullHour:{}} as DatePhoto;
  }

  public getToday():DatePhoto
  {
   const today=new Date();
   today.getDate();

   const numberDay=format(today,'dd',{locale:es});
   const year=format(today,'yyyy',{locale:es});
   const numberMonth= format(today,'MM',{locale:es});
   const hour=format(today,'HH',{locale:es});
   const minute=format(today,'mm',{locale:es});


   this.datePhoto.day=numberDay;
   this.datePhoto.month=numberMonth;
   this.datePhoto.year=year;
   this.datePhoto.fullHour.hour=hour;
   this.datePhoto.fullHour.minute=minute;

   return this.datePhoto;
  }

}

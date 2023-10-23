import { DatePhoto } from "./date";

export interface Photo {
    uid:string;
    uidUser:string;
    url:string;
    name:string;
    likes:number;
    userLiked:boolean;
    uidLikes:string[];
    date: DatePhoto;
    value:string;
}

import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { v4 as uuid } from "uuid";

@Injectable({
  providedIn: "root"
})
export class UploadService {
  imageSrc;
  constructor(private storage: AngularFireStorage) {}

  setImage(img: string) {
    this.imageSrc = img;
  }

  getImage() {
    return this.imageSrc;
  }

  getImagePath(eventId: string) {
    return this.storage
      .ref(`event-images/${eventId}/image1.jpg`)
      .getDownloadURL();
  }

  imageUpload() {
    return this.storage
      .ref(`event-images/${uuid()}/image1.jpg`)
      .putString(this.imageSrc, "data_url");
  }
}

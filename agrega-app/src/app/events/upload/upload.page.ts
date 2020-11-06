import { Component, OnInit, NgZone } from "@angular/core";
import { ModalController, ActionSheetController } from "@ionic/angular";
import { UploadService } from "src/app/services/upload/upload.service";
import { Router } from "@angular/router";
import {
  Camera,
  CameraOptions,
  PictureSourceType
} from "@ionic-native/camera/ngx";

@Component({
  selector: "app-upload",
  templateUrl: "./upload.page.html",
  styleUrls: ["./upload.page.scss"]
})
export class UploadPage implements OnInit {
  imageSrc: string;

  constructor(
    private uploadService: UploadService,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.imageSrc = this.uploadService.getImage();
  }

  addEvent() {
    if (this.imageSrc)
      this.zone.run(() => this.router.navigate(["/event/add"]));
  }

  changeImage() {
    this.selectImage();
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Selecione a origem da imagem do evento",
      buttons: [
        {
          text: "Carregar da Galeria",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: "Cancelar",
          role: "cancel"
        }
      ]
    });
    await actionSheet.present();
  }

  async takePicture(sourceType: PictureSourceType) {
    const options: CameraOptions = await {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      encodingType: this.camera.EncodingType.JPEG,
      allowEdit: true
    };
    this.uploadService.setImage(
      "data:image/jpg;base64," + (await this.camera.getPicture(options))
    );
    this.imageSrc = this.uploadService.getImage();
  }
}

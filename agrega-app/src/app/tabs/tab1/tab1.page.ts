import { Component, ViewChild, OnInit } from "@angular/core";
import {
  IonSlides,
  ActionSheetController,
  ModalController
} from "@ionic/angular";
import { Router } from "@angular/router";
import { UploadService } from "src/app/services/upload/upload.service";
import {
  Camera,
  CameraOptions,
  PictureSourceType
} from "@ionic-native/camera/ngx";
import { EventService } from "src/app/services/event/event.service";
import {
  QueryDocumentSnapshot,
  QuerySnapshot,
  DocumentSnapshot
} from "@angular/fire/firestore";
import { DateService } from "src/app/services/date/date.service";
import { LocateService } from "src/app/services/locate/locate.service";
import { Deeplinks } from "@ionic-native/deeplinks/ngx";
import { EventPage } from "../../events/event/event.page";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page implements OnInit {
  @ViewChild("slider") slider: IonSlides;
  public slide = "0";
  events: any;
  nearEvents: Array<Object> = [];
  Address: String = "Localização não encontrada";
  constructor(
    private router: Router,
    private uploadService: UploadService,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private eventService: EventService,
    private modalController: ModalController,
    private dateService: DateService,
    private locateService: LocateService
  ) {}

  ngOnInit(): void {
    this.loadEvents(null);
  }

  checkDate(date) {
    return this.dateService.checkDate(date);
  }

  async loadEvents(event) {
    this.eventService.getEventsLive(5).subscribe(doc => {
      this.events = doc.map(a => {
        const data: any = a.payload.doc.data();
        data.Id = a.payload.doc.id;
        return data;
      });
    });

    this.loadNearbyEvents();
  }

  loadNearbyEvents() {
    this.nearEvents = [];
    this.locateService.getNearbyCities().then((cities: any) => {
      cities.subscribe(data => {
        data.geonames.map(loc => {
          if (this.events) {
            this.events.forEach(event => {
              if (event.Address.includes(loc.name))
                this.nearEvents.push({ ...event });
            });
          }
        });
      });
    });
    this.locateService.getMyCity().subscribe(results => {
      if (results) {
        this.Address = results[0].formatted_address;
      }
    });
  }

  selectedTab(ind) {
    this.slider.slideTo(ind);
  }

  moveButton() {
    this.slider.getActiveIndex().then(data => (this.slide = data.toString()));
  }

  addEvent() {
    this.selectImage();
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Selecione uma Imagem para Adicionar um Evento",
      buttons: [
        {
          text: "Carregar da Galeria",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        // {
        //   text: "Usar Camera",
        //   handler: () => {
        //     this.takePicture(this.camera.PictureSourceType.CAMERA);
        //   }
        // },
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
    this.router.navigate(["/upload"]);
  }

  eventOpen(Id: string) {
    this.router.navigate(["/tabs/event", Id]);
  }
}

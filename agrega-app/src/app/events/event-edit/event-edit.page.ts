import { Component, OnInit } from "@angular/core";
import {
  ModalController,
  AlertController,
  ToastController,
  NavController,
  ActionSheetController
} from "@ionic/angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/utils/loading.service";
import { EventService, Event } from "src/app/services/event/event.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { SearchAddressPage } from "src/app/search-address/search-address.page";
import { ActivatedRoute, Router } from "@angular/router";
import { UploadService } from "src/app/services/upload/upload.service";
import {
  Camera,
  CameraOptions,
  PictureSourceType
} from "@ionic-native/camera/ngx";

@Component({
  selector: "app-event-edit",
  templateUrl: "./event-edit.page.html",
  styleUrls: ["./event-edit.page.scss"]
})
export class EventEditPage implements OnInit {
  eventEditForm: FormGroup;
  submitted: boolean;
  toggleTime: boolean = false;
  minDate: string = new Date().toISOString();
  isModalOpen: boolean = false;
  event: any;
  eventId: string;
  imageSrc: string = null;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private eventService: EventService,
    public alertController: AlertController,
    private loading: LoadingService,
    private toast: ToastController,
    public storage: AngularFireStorage,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private uploadService: UploadService,
    private actionSheetController: ActionSheetController,
    private camera: Camera
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventService.getEvent(params["id"]).subscribe(documentSnapshot => {
        this.eventId = params["id"];
        let data = documentSnapshot.data();
        this.event = {
          Id: documentSnapshot.id,
          ...data
        };
        delete data.imagePath;
        delete data.user;
        data.Description = data.Description.split("\\n")
          .join("\n")
          .split('"')
          .join("");

        this.eventEditForm.setValue({
          ...data
        });
      });
    });
    this.eventEditForm = this.formBuilder.group({
      Title: [
        "",
        [Validators.required, Validators.minLength(5), Validators.maxLength(25)]
      ],
      Subtitle: [""],
      Description: ["", [Validators.required, Validators.minLength(5)]],
      Address: ["", [Validators.required, Validators.minLength(5)]],
      Complement: [""],
      Category: ["", [Validators.required]],
      Date: ["", [Validators.required]],
      finalDate: ["", [Validators.required]],
      Time: [""],
      finalTime: [""],
      Url: [""],
      hasId: [false]
    });
    const { Time, finalTime, Description } = this.eventEditForm.controls;
    if (!Time.value || !finalTime.value) {
      this.toggleTime = true;
    }
  }

  get f() {
    return this.eventEditForm.controls;
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async openSelectAddress() {
    if (!this.isModalOpen) {
      this.isModalOpen = true;
      const modal = await this.modalController.create({
        component: SearchAddressPage
      });
      modal.onDidDismiss().then(data => {
        if (data.data) this.eventEditForm.controls.Address.setValue(data.data);
        this.isModalOpen = false;
      });
      return await modal.present();
    }
  }

  setToggleTime() {
    this.toggleTime = !this.toggleTime;
    if (!this.toggleTime) {
      const { Time, finalTime } = this.eventEditForm.controls;
      Time.setValue("");
      finalTime.setValue("");
    }
  }

  async onSubmit() {
    this.submitted = true;
    if (this.eventEditForm.invalid) {
      await this.presentAlert({
        header: "Atenção",
        message: "Preencha todos os campos obrigatórios"
      });
      return;
    }

    if (this.imageSrc) {
      this.createUploadTask();
    } else {
      this.eventEdit(null);
    }
  }

  createUploadTask(): void {
    this.uploadService.imageUpload().then(uploadTaskSnapshot => {
      uploadTaskSnapshot.task.then(uploadTaskSnapshot => {
        uploadTaskSnapshot.ref
          .getDownloadURL()
          .then(data => this.eventEdit(data));
      });
    });
  }

  async eventEdit(imagePath: String) {
    var load = await this.loading.Init();

    await load.present();
    const form = this.eventEditForm.value;
    form.Description = JSON.stringify(form.Description);
    const ev: Event = this.eventEditForm.value;
    if (imagePath) ev.imagePath = imagePath;
    this.eventService
      .eventEdit(ev, this.eventId)
      .then(result => {
        load.dismiss();

        this.presentToast();
        this.navCtrl.goBack();
      })
      .catch(err => {
        load.dismiss();
        this.presentAlert({
          header: "Erro",
          message: err
        });
      });
  }

  async presentToast() {
    const toast = await this.toast.create({
      message: "Evento editado com sucesso!",
      duration: 2000
    });
    toast.present();
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      message,
      buttons: ["OK"]
    });

    await alert.present();
  }

  customCategoryOptions: any = {
    header: "Categorias"
  };

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
    var load = await this.loading.Init();

    await load.present();
    this.uploadService.setImage(
      "data:image/jpg;base64," + (await this.camera.getPicture(options))
    );
    this.imageSrc = this.uploadService.getImage();
    load.dismiss();
  }
}

import { Component, OnInit } from "@angular/core";
import {
  ModalController,
  AlertController,
  ToastController,
  NavController
} from "@ionic/angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoadingService } from "src/app/utils/loading.service";
import { EventService } from "src/app/services/event/event.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { UploadService } from "src/app/services/upload/upload.service";
import { SearchAddressPage } from "src/app/search-address/search-address.page";

@Component({
  selector: "app-event-add",
  templateUrl: "./event-add.page.html",
  styleUrls: ["./event-add.page.scss"]
})
export class EventAddPage implements OnInit {
  eventAddForm: FormGroup;
  submitted: Boolean;
  minDate: String = new Date().toISOString();
  isModalOpen: Boolean = false;
  toggleTime: Boolean = false;
  isLoading: Boolean = false;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private eventService: EventService,
    public alertController: AlertController,
    private loading: LoadingService,
    private toast: ToastController,
    public storage: AngularFireStorage,
    private uploadService: UploadService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.eventAddForm = this.formBuilder.group({
      Title: ["", [Validators.required, Validators.minLength(5)]],
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
  }

  get f() {
    return this.eventAddForm.controls;
  }

  setToggleTime() {
    this.toggleTime = !this.toggleTime;
    if (!this.toggleTime) {
      const { Time, finalTime } = this.eventAddForm.controls;
      Time.setValue("");
      finalTime.setValue("");
    }
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
        if (data.data) this.eventAddForm.controls.Address.setValue(data.data);
        this.isModalOpen = false;
      });
      return await modal.present();
    }
  }

  async onSubmit() {
    this.submitted = true;
    if (this.eventAddForm.invalid) {
      await this.presentAlert({
        header: "Atenção",
        message: "Preencha todos os campos obrigatórios"
      });
      return;
    }

    this.createUploadTask();
  }

  async eventAdd(imagePath: string) {
    if (this.isLoading) return;
    this.isLoading = true;
    var load = await this.loading.Init();

    await load.present();
    const form = this.eventAddForm.value;
    form.Description = JSON.stringify(form.Description);
    this.eventService
      .eventAdd({ ...form, imagePath })
      .then(result => {
        this.dismiss();
        load.dismiss();
        this.navCtrl.navigateRoot("/");
        this.presentToast();
        this.isLoading = false;
      })
      .catch(err => {
        load.dismiss();
        this.presentAlert({
          header: "Erro",
          message: err
        });
        this.isLoading = false;
      });
  }

  async createUploadTask() {
    const loading = await this.loading.InitText("Salvando Imagem...");
    await loading.present();
    this.uploadService.imageUpload().then(uploadTaskSnapshot => {
      uploadTaskSnapshot.task.then(uploadTaskSnapshot => {
        uploadTaskSnapshot.ref.getDownloadURL().then(data => {
          loading.dismiss();
          this.eventAdd(data);
        });
      });
    });
  }

  async presentToast() {
    const toast = await this.toast.create({
      message: "Evento criado com sucesso!",
      duration: 2000
    });
    toast.present();
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      ...message,
      buttons: ["OK"]
    });

    await alert.present();
  }

  customCategoryOptions: any = {
    header: "Categorias"
  };
}

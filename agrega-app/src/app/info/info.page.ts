import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  ModalController,
  AlertController,
  ToastController
} from "@ionic/angular";
import { AuthService } from "../services/auth/auth.service";
import { LoadingService } from "../utils/loading.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-info",
  templateUrl: "./info.page.html",
  styleUrls: ["./info.page.scss"]
})
export class InfoPage implements OnInit {
  infoForm: FormGroup;
  submitted: boolean;
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    public alertController: AlertController,
    private loading: LoadingService,
    private toast: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.infoForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      cpf: ["", [Validators.required]]
      // gender: ["", [Validators.required]],
      // age: ["", [Validators.required]]
    });

    this.auth.verifyInfos().subscribe(user => {
      const { name, cpf } = user.data();
      if (name != null && cpf != null) {
        this.dismiss();
        this.router.navigate(["/tabs/tab1"]);
      }
    });
  }

  get f() {
    return this.infoForm.controls;
  }
  dismiss() {
    this.modalController.dismiss();
  }

  async onSubmit() {
    this.submitted = true;
    if (this.infoForm.invalid) return;
    var load = await this.loading.Init();

    await load.present();
    this.auth.getEmail().subscribe(data => {
      this.auth
        .saveUserData({
          ...this.infoForm.value,
          email: data.email
        })
        .then(result => {
          load.dismiss();

          this.presentToast();
          this.dismiss();
        })
        .catch(err => {
          load.dismiss();
          this.presentAlert({
            header: "Erro",
            message: err
          });
        })
        .catch(err => {
          load.dismiss();
          this.presentAlert({
            header: "Erro",
            message: err
          });
        });
    });
  }

  async presentToast() {
    const toast = await this.toast.create({
      message: "Usuário atualizado com sucesso!",
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
}

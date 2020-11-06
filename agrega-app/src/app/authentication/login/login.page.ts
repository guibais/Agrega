import { Component, OnInit } from "@angular/core";
import { ModalController, AlertController } from "@ionic/angular";
import { RegisterPage } from "../register/register.page";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { Router } from "@angular/router";
import { LoadingService } from "../../utils/loading.service";
import { ErrorValidationService } from "src/app/services/errorValidation/error-validation.service";
import { ForgotPassPage } from "../forgot-pass/forgot-pass.page";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  submitted: boolean;
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    public alertController: AlertController,
    private router: Router,
    private loading: LoadingService,
    private errorValidation: ErrorValidationService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.minLength(3)]],
      pass: ["", Validators.required]
    });
  }

  ngOnInit() {}

  get f() {
    return this.loginForm.controls;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;
    var load = await this.loading.Init();

    await load.present();
    this.auth
      .doLogin(this.loginForm.value)
      .then(result => {
        load.dismiss();
        this.router.navigate(["/"]);
        this.dismiss();
      })
      .catch(err => {
        load.dismiss();
        this.presentAlert({
          header: "Erro",
          message: err
        });
      });
  }

  async openForgot() {
    const modal = await this.modalController.create({
      component: ForgotPassPage
    });
    return await modal.present();
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      ...message,
      buttons: ["OK"]
    });

    await alert.present();
  }

  dismiss() {
    this.modalController.dismiss();
  }
}

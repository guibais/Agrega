import { Component, OnInit, ɵConsole } from "@angular/core";
import {
  ModalController,
  AlertController,
  LoadingController
} from "@ionic/angular";
import { Validators, FormGroup, FormBuilder } from "@angular/forms";
import { AuthService } from "src/app/services/auth/auth.service";
import { LoadingService } from "src/app/utils/loading.service";
import { ErrorValidationService } from "src/app/services/errorValidation/error-validation.service";

@Component({
  selector: "app-forgot-pass",
  templateUrl: "./forgot-pass.page.html",
  styleUrls: ["./forgot-pass.page.scss"]
})
export class ForgotPassPage implements OnInit {
  forgotForm: FormGroup;
  submitted: boolean;
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private loading: LoadingService,
    private alertController: AlertController,
    private errorValidation: ErrorValidationService
  ) {}

  ngOnInit() {
    this.forgotForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.minLength(3)]]
    });
  }

  get f() {
    return this.forgotForm.controls;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.forgotForm.invalid) return;

    var load = await this.loading.Init();

    await load.present();

    this.auth
      .resetPassword(this.forgotForm.controls.email.value)
      .then(data => {
        load.dismiss();
        this.presentAlert("Email enviado. Verifique sua caixa de entrada");
        this.dismiss();
      })
      .catch(err => {
        load.dismiss();
        this.presentAlert(this.errorValidation.ForgotPassErrors(err.code));
      });
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      message,
      buttons: ["OK"]
    });

    await alert.present();
  }

  dismiss() {
    this.modalController.dismiss();
  }
}

import { Component, OnInit } from "@angular/core";
import {
  ModalController,
  AlertController,
  ToastController
} from "@ionic/angular";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { LoadingService } from "../../utils/loading.service";
import { ErrorValidationService } from "src/app/services/errorValidation/error-validation.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit {
  public ages = [];
  registerForm: FormGroup;
  submitted: boolean;
  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    public alertController: AlertController,
    private loading: LoadingService,
    private toast: ToastController,
    private errorValidation: ErrorValidationService,
    private router: Router
  ) {}

  ngOnInit() {
    for (let x = 2010; x >= 1910; x--) {
      this.ages.push(x);
    }
    this.registerForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      // gender: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      cpf: ["", [Validators.required]],
      // age: ["", [Validators.required]],
      pass: ["", Validators.required],
      verifyPass: ["", Validators.required]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) return;
    var load = await this.loading.Init();

    await load.present();
    this.auth
      .doRegister(this.registerForm.value)
      .then(result => {
        this.auth
          .saveUserData(this.registerForm.value)
          .then(result => {
            load.dismiss();
            this.router.navigate(["/tabs/tab1"]);
            this.dismiss();
            this.presentToast();
          })
          .catch(err => {
            load.dismiss();
            this.presentAlert({
              header: "Erro",
              message: err
            });
          });
      })
      .catch(err => {
        load.dismiss();
        console.log(err);
        this.presentAlert({
          header: "Erro",
          message: this.errorValidation.SignUpErrors(err.code)
        });
      });
  }

  async presentToast() {
    const toast = await this.toast.create({
      message: "Usuário criado com sucesso!",
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

import { Component, OnInit, ViewChild, NgZone } from "@angular/core";
import { ModalController, AlertController, IonSlides } from "@ionic/angular";
import { RegisterPage } from "../register/register.page";
import { LoginPage } from "../login/login.page";
import { AuthService } from "../../services/auth/auth.service";
import { Router } from "@angular/router";
import { SlidesFile } from "./slides";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { LoadingService } from "../../utils/loading.service";
import * as firebase from "firebase";
import { AngularFireAuth } from "@angular/fire/auth";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook/ngx";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  public backgroundColor: string = "#7989C4";
  slideOpts = {
    effect: "flip"
  };

  constructor(
    private modalController: ModalController,
    private router: Router,
    private auth: AuthService,
    private alertController: AlertController,
    private statusBar: StatusBar,
    private loading: LoadingService,
    private ngZone: NgZone,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private fb: Facebook
  ) {}

  ngOnInit() {
    this.statusBar.styleBlackTranslucent();
    this.authService
      .isLoggedIn()
      .then(() => this.router.navigate(["/tabs/tab1"]));
  }

  async openRegister() {
    const modal = await this.modalController.create({
      component: RegisterPage
    });
    return await modal.present();
  }

  async openLogin() {
    const modal = await this.modalController.create({
      component: LoginPage
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

  async loginFacebook() {
    var load = await this.loading.Init();

    await load.present();
    this.fb
      .login(["email"])
      .then((response: FacebookLoginResponse) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(
          response.authResponse.accessToken
        );
        firebase
          .auth()
          .signInWithCredential(facebookCredential)
          .then(success => {
            load.dismiss();
            this.ngZone.run(() => {
              this.router.navigate(["/tabs/tab1"]);
            });
          }).catch(err => {
            load.dismiss();
            this.presentAlert({
              header: "Erro",
              message: err
            });
          });
      })
      .catch(err => {
        load.dismiss();
        this.presentAlert({
          header: "Erro",
          message: err
        });
      });
  }
}

import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./services/auth/auth.service";
import { ModalController } from "@ionic/angular";
import { InfoPage } from "./info/info.page";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    public modalController: ModalController
  ) {}

  async presentModal() {
    const modal = await this.modalController.create({
      component: InfoPage
    });
    return await modal.present();
  }

  canActivate(): Promise<boolean> {
    return this.authService.isLoggedIn().then(user => {
      if (user) {
        this.authService.verifyInfos().subscribe(user => {
          if (!user.data()) {
            this.presentModal();
            return false;
          }
          const { name, cpf } = user.data();
          if (name == null || cpf == null) {
            this.presentModal();
            return false;
          }
        });
        return true;
      } else {
        this.router.navigate(["/home"]);
        return false;
      }
    });
  }
}

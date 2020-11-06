import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class LoadingService {
  private loading;

  constructor(public loadingController: LoadingController) {}

  async Init() {
    return await this.loadingController.create({
      message: "Por favor aguarde...",
      spinner: "crescent"
    });
  }

  async InitText(text: string) {
    return await this.loadingController.create({
      message: text,
      spinner: "crescent"
    });
  }
}

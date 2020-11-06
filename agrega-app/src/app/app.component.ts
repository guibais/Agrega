import { Component, ViewChild } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Deeplinks } from "@ionic-native/deeplinks/ngx";
import { Tab3Page } from "./tabs/tab3/tab3.page";
import { Router } from "@angular/router";
import { EventPage } from "./events/event/event.page";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private deeplinks: Deeplinks,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#383e86");
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.deeplinks
        .route({
          "/:type/:id": EventPage
        })
        .subscribe(
          match => {
            // match.$route - the route we matched, which is the matched entry from the arguments to route()
            // match.$args - the args passed in the link
            // match.$link - the full link data
            if (match.$args.type == "event")
              this.router.navigate(["/tabs/event", match.$args.id]);
          },
          nomatch => {
            // nomatch.$link - the full link data
            console.error("Got a deeplink that didn't match", nomatch);
          }
        );
    });
  }
}

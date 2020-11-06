import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RegisterPageModule } from "./authentication/register/register.module";
import { LoginPageModule } from "./authentication/login/login.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { environment } from "src/environments/environment";
import { ServiceWorkerModule } from "@angular/service-worker";
import { Camera } from "@ionic-native/camera/ngx";
import { SearchAddressPageModule } from "./search-address/search-address.module";
import { HttpClientModule } from "@angular/common/http";
import { NgAisModule } from "angular-instantsearch";
import { ForgotPassPageModule } from "./authentication/forgot-pass/forgot-pass.module";
import { Facebook } from "@ionic-native/facebook/ngx";
import { InfoPageModule } from "./info/info.module";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    RegisterPageModule,
    LoginPageModule,
    ForgotPassPageModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    NgAisModule,
    InfoPageModule,
    SearchAddressPageModule,
    HttpClientModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

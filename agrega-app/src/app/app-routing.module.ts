import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./auth.guard";

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      { path: "", loadChildren: "./tabs/tabs.module#TabsPageModule" },
      { path: "info", loadChildren: "./info/info.module#InfoPageModule" },
      {
        path: "event",
        children: [
          {
            path: "add",
            loadChildren:
              "./events/event-add/event-add.module#EventAddPageModule"
          },
          {
            path: "edit/:id",
            loadChildren:
              "./events/event-edit/event-edit.module#EventEditPageModule"
          }
        ]
      },
      {
        path: "upload",
        loadChildren: "./events/upload/upload.module#UploadPageModule"
      }
    ]
  },
  {
    path: "login",
    loadChildren: "./authentication/login/login.module#LoginPageModule"
  },
  {
    path: "register",
    loadChildren: "./authentication/register/register.module#RegisterPageModule"
  },
  {
    path: "home",
    loadChildren: "./authentication/home/home.module#HomePageModule"
  },
  {
    path: "search",
    loadChildren:
      "./search-address/search-address.module#SearchAddressPageModule"
  },
  {
    path: "special",
    loadChildren: "./tabs/special/special.module#SpecialPageModule"
  },
  {
    path: "events",
    loadChildren: "./tabs/events/events.module#EventsPageModule"
  },
  {
    path: "event-edit",
    loadChildren: "./events/event-edit/event-edit.module#EventEditPageModule"
  },
  {
    path: "forgot-pass",
    loadChildren:
      "./authentication/forgot-pass/forgot-pass.module#ForgotPassPageModule"
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

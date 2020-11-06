import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-settings-menu",
  templateUrl: "./settings-menu.component.html",
  styleUrls: ["./settings-menu.component.scss"]
})
export class SettingsMenuComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  Logout() {
    this.authService.Logout().then(() => {
      this.router.navigate(["home"]);
    });
  }
}

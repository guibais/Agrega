import { Component, ViewChild } from "@angular/core";
import { MenuController, IonSlides } from "@ionic/angular";
import { EventService } from "src/app/services/event/event.service";
import { DocumentReference } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";
import * as dateFns from "date-fns";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"]
})
export class Tab3Page {
  @ViewChild("slider") slider: IonSlides;
  public slide = "0";
  public futureEvents = [];
  public pastEvents = [];
  ref: DocumentReference;
  profileName: string;

  constructor(
    private menu: MenuController,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents(null);
    this.getProfile();
  }

  getProfile() {
    this.authService.getUserData().subscribe(documentSnapshot => {
      this.profileName = documentSnapshot.data().name;
    });
  }

  loadEvents(event) {
    this.eventService.getFutureEvents().subscribe(querySnapshot => {
      const promise = querySnapshot.docs.map(documentSnapshot => {
        return documentSnapshot
          .data()
          .Event.get()
          .then(documentSnapshot => {
            if (event) event.target.complete();
            let data = documentSnapshot.data();
            return {
              Id: documentSnapshot.id,
              ...data
            };
          });
      });
      Promise.all(promise).then(results => {
        console.log(results);
        this.futureEvents = results
          .sort((a, b) => {
            if (a.finalDate < b.finalDate) return -1;
            if (a.finalDate > b.finalDate) return 1;
          })
          .filter(
            a =>
              a.finalDate >=
              dateFns.format(dateFns.startOfToday(), "YYYY-MM-DD")
          );
        this.pastEvents = results
          .sort((a, b) => {
            if (a.finalDate > b.finalDate) return -1;
            if (a.finalDate < b.finalDate) return 1;
          })
          .filter(
            a =>
              a.finalDate < dateFns.format(dateFns.startOfToday(), "YYYY-MM-DD")
          );
      });
      if (event) event.target.complete();
    });
  }

  openMenu() {
    this.menu.open("settings");
  }

  selectedTab(ind) {
    this.slider.slideTo(ind);
  }

  moveButton() {
    this.slider.getActiveIndex().then(data => (this.slide = data.toString()));
  }

  eventOpen(Id: string) {
    this.router.navigate(["tabs/tab3/event", Id]);
  }
}

import { Component, OnInit } from "@angular/core";
import { EventService } from "src/app/services/event/event.service";
import { QuerySnapshot, DocumentSnapshot } from "@angular/fire/firestore";
import { Router } from "@angular/router";

@Component({
  selector: "app-events",
  templateUrl: "./events.page.html",
  styleUrls: ["./events.page.scss"]
})
export class EventsPage {
  events = [];

  constructor(private eventService: EventService, private router: Router) {}

  ionViewDidEnter() {
    this.loadEvents(null);
  }

  loadEvents(event) {
    this.eventService
      .getEventsFromUser()
      .subscribe((querySnapshot: QuerySnapshot<any>) => {
        this.events = querySnapshot.docs.map(
          (documentSnapshot: DocumentSnapshot<any>) => {
            if (event) event.target.complete();
            let data = documentSnapshot.data();

            return {
              Id: documentSnapshot.id,
              ...data
            };
          }
        );
        if (event) event.target.complete();
      });
  }

  eventOpen(Id: string) {
    this.router.navigate(["/tabs/events/event", Id]);
  }
}

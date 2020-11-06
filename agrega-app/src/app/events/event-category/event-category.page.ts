import { Component, OnInit } from "@angular/core";
import { EventService } from "src/app/services/event/event.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-event-category",
  templateUrl: "./event-category.page.html",
  styleUrls: ["./event-category.page.scss"]
})
export class EventCategoryPage implements OnInit {
  events: any;
  category: string;
  dateNow = new Date().toISOString();
  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEvents(null);
  }

  loadEvents(event) {
    this.route.params.subscribe(params => {
      this.category = params["name"];
      this.eventService.getCategory(this.category).subscribe(querySnapshot => {
        this.events = querySnapshot.docs.map(documentSnapshot => {
          if (event) event.target.complete();
          const data = documentSnapshot.data();
          return {
            Id: documentSnapshot.id,
            ...data
          };
        });
        if (event) event.target.complete();
      });
    });
  }

  eventOpen(Id: string) {
    this.router.navigate(["/tabs/tab2/event", Id]);
  }
}

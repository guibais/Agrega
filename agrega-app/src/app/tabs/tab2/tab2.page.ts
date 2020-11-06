import { Component } from "@angular/core";
import cards from "./cards";
import { Router } from "@angular/router";
import { EventService } from "src/app/services/event/event.service";
import { environment } from "src/environments/environment";
import * as algoliasearch from "algoliasearch";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page {
  public cards;
  public isFocused: boolean = false;
  public searchInput: string;
  public search: any;
  public searchResult: any;
  public client: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.cards = cards;
    this.client = algoliasearch(
      environment.algolia.appId,
      environment.algolia.appKey,
      { protocol: "https" }
    );
  }

  onFocus() {
    this.isFocused = true;
  }

  offFocus() {
    this.isFocused = false;
    this.searchResult = "";
  }

  openCategory(name: string) {
    this.router.navigate(["tabs/tab2/category", name.toLowerCase()]);
  }

  eventOpen(id: string) {
    this.router.navigate(["tabs/tab2/event", id]);
  }

  searchEvents() {
    if (this.isFocused && this.searchInput.length > 3) {
      const index = this.client.initIndex("event_search");
      index
        .search({
          query: this.searchInput,
          attributesToRetrieve: [
            "Title",
            "Date",
            "finalDate",
            "imagePath",
            "Category",
            "objectID"
          ]
        })
        .then(data => {
          this.searchResult = data.hits;
          console.log(data.hits);
        });
    }
  }
}

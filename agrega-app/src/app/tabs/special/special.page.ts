import { Component, OnInit } from "@angular/core";
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from "@ionic-native/google-maps/ngx";
import { EventService } from "src/app/services/event/event.service";
import { AngularFirestoreDocument } from "@angular/fire/firestore";
import { Router } from "@angular/router";

@Component({
  selector: "app-special",
  templateUrl: "./special.page.html",
  styleUrls: ["./special.page.scss"]
})
export class SpecialPage implements OnInit {
  map: GoogleMap;
  events;

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit() {
    this.eventService
      .getSpecialEvents("mackinova")
      .subscribe(documentSnapshot => {
        const promise = documentSnapshot.data().events.map(event => {
          return event.get().then(documentSnapshot => {
            const data = documentSnapshot.data();
            return {
              Id: documentSnapshot.id,
              ...data
            };
          });
        });
        Promise.all(promise).then(results => {
          this.events = results;
        });
      });
    // this.loadMap();
  }

  eventOpen(Id: string) {
    this.router.navigate(["/tabs/special/event", Id]);
  }

  loadMap() {
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: -23.547955,
          lng: -46.652183
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create("map_canvas", mapOptions);

    let marker: Marker = this.map.addMarkerSync({
      title: "MackInova",
      icon: "blue",
      animation: "DROP",
      position: {
        lat: 43.0741904,
        lng: -89.3809802
      }
    });
    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
      this.map.addMarker({
        position: {
          lat: -23.547955,
          lng: -46.652183
        },
        visible: true
      });
    });
  }
}

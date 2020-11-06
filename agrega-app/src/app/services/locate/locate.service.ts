/// <reference path="../../../../node_modules/@types/googlemaps/index.d.ts" />
import { Injectable } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { HttpClient } from "@angular/common/http";
import { Observable, Observer } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class LocateService {
  private geocoder: google.maps.Geocoder;
  constructor(private geolocation: Geolocation, private http: HttpClient) {
    this.geocoder = new google.maps.Geocoder();
  }

  getNearbyCities() {
    return this.geolocation
      .getCurrentPosition()
      .then(resp => {
        // resp.coords.latitude
        // resp.coords.longitude
        return this.http.get(
          `http://api.geonames.org/findNearbyPlaceNameJSON?lat=${
            resp.coords.latitude
          }&lng=${
            resp.coords.longitude
          }&radius=50&maxRows=20&username=guibais&language=pt_BR&country=BR&cities=cities15000`
        );
      })
      .catch(error => {
        console.log("Error getting location", error);
      });
  }

  getMyCity(): Observable<google.maps.GeocoderResult[]> {
    return Observable.create(
      (observer: Observer<google.maps.GeocoderResult[]>) => {
        return this.geolocation.getCurrentPosition().then(resp => {
          let latlng = {
            lat: resp.coords.latitude,
            lng: resp.coords.longitude
          };
          this.geocoder.geocode(
            { location: latlng },
            (
              results: google.maps.GeocoderResult[],
              status: google.maps.GeocoderStatus
            ) => {
              if (status === google.maps.GeocoderStatus.OK) {
                observer.next(
                  results.filter(res => res.types.includes("political"))
                );

                observer.complete();
              } else {
                console.log(
                  "Geocoding service: geocoder failed due to: " + status
                );
                observer.error(status);
              }
            }
          );
        });
        // Invokes geocode method of Google Maps API geocoding.
      }
    );
  }
}

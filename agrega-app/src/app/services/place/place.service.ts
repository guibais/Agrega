/// <reference path="../../../../node_modules/@types/googlemaps/index.d.ts" />
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class PlaceService {
  selectedAddress: google.maps.places.AutocompletePrediction;
  constructor() {}

  addCompleteAddress(address: google.maps.places.AutocompletePrediction) {
    this.selectedAddress = address;
  }

  getAddress() {
    return this.selectedAddress;
  }
}

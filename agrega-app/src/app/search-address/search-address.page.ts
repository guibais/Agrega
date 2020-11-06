/// <reference path="../../../node_modules/@types/googlemaps/index.d.ts" />
import { Component, OnInit, NgZone, Input } from "@angular/core";
import { PlaceService } from "../services/place/place.service";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-search-address",
  templateUrl: "./search-address.page.html",
  styleUrls: ["./search-address.page.scss"]
})
export class SearchAddressPage implements OnInit {
  inputAddress: string;
  GoogleAutocomplete: google.maps.places.AutocompleteService;
  AddressList: Array<google.maps.places.AutocompletePrediction>;

  @Input() Address: number;

  constructor(
    private _ngZone: NgZone,
    private placeService: PlaceService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
  }

  Close(Data: string) {
    this.modalController.dismiss(Data);
  }

  searchAddress() {
    if (this.inputAddress.length >= 5) {
      this.GoogleAutocomplete.getPlacePredictions(
        {
          input: this.inputAddress,
          componentRestrictions: { country: "br" }
        },
        (predictions, status) => {
          this._ngZone.run(() => {
            this.AddressList = predictions;
          });
        }
      );
    }
  }
  selectAddress(address: google.maps.places.AutocompletePrediction) {
    this.Close(address.description);
  }
}

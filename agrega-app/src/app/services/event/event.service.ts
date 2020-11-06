import { Injectable } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase";
import { UploadService } from "../upload/upload.service";
import * as dateFns from "date-fns";
export class Event {
  Title;
  Subtitle;
  Description;
  Address;
  Complement;
  Time;
  Url;
  imagePath;
}
@Injectable({
  providedIn: "root"
})
export class EventService {
  currentUser = this.auth.getUser();
  constructor(
    private auth: AuthService,
    private afFire: AngularFirestore,
    private uploadService: UploadService
  ) {}

  eventAdd(event: Event) {
    const params = {
      ...event,
      user: firebase.firestore().doc("users/" + this.currentUser.uid)
    };

    return this.afFire.collection(`events`).add(params);
  }

  eventEdit(event: Event, id: string) {
    return this.afFire
      .collection(`events`)
      .doc(id)
      .update(event);
  }

  deleteEvent(id: string) {
    return this.afFire
      .collection("events")
      .doc(id)
      .delete();
  }

  getEvents(limit) {
    return this.afFire
      .collection("events", ref =>
        ref
          .where(
            "finalDate",
            ">=",
            dateFns.format(dateFns.startOfToday(), "YYYY-MM-DD")
          )
          .orderBy("finalDate", "asc")
          .limit(limit)
      )
      .get();
  }

  getEventsLive(limit) {
    return this.afFire
      .collection("events", ref =>
        ref
          .where(
            "finalDate",
            ">=",
            dateFns.format(dateFns.startOfToday(), "YYYY-MM-DD")
          )
          .orderBy("finalDate", "asc")
          .limit(limit)
      )
      .snapshotChanges();
  }

  getEvent(id: string) {
    return this.afFire
      .collection("events")
      .doc(id)
      .get();
  }

  getEventLive(id: string) {
    return this.afFire
      .collection("events")
      .doc(id)
      .valueChanges();
  }

  getCategory(category: string) {
    return this.afFire
      .collection("events", ref =>
        ref.where("Category", "==", category).orderBy("Date", "desc")
      )
      .get();
  }

  searchEvents(search: string) {
    return this.afFire
      .collection("events", ref => ref.where("title", ">=", search))
      .get();
  }

  setEventInterest(id: string, Interest: boolean, date, userId: String) {
    if (Interest) {
      return this.afFire
        .collection(`user_event`)
        .doc(`${this.currentUser.uid}_${id}`)
        .set({
          User: this.currentUser.uid,
          Event: firebase.firestore().doc("events/" + id),
          Interest: true,
          userId
        });
    } else {
      return this.afFire
        .collection(`user_event`)
        .doc(`${this.currentUser.uid}_${id}`)
        .set({
          Interest: false
        });
    }
  }

  getSpecialEvents(specialId) {
    return this.afFire
      .collection("specialEvents")
      .doc(specialId)
      .get();
  }

  getEventUser(id: string) {
    return this.afFire
      .collection(`user_event`)
      .doc(`${this.currentUser.uid}_${id}`)
      .get();
  }

  getFutureEvents() {
    return this.afFire
      .collection("user_event", ref =>
        ref.where("User", "==", this.currentUser.uid)
      )
      .get();
  }

  getInterests(id: string) {
    return this.afFire
      .collection("user_event", ref =>
        ref
          .where("Event", "==", firebase.firestore().doc("events/" + id))
          .where("Interest", "==", true)
      )
      .valueChanges();
  }

  getEventsFromUser() {
    return this.afFire
      .collection("events", ref =>
        ref.where(
          "user",
          "==",
          firebase.firestore().doc("users/" + this.currentUser.uid)
        )
      )
      .get();
  }
}

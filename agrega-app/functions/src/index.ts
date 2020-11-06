import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();
import * as algoliasearch from "algoliasearch";

const client = algoliasearch("VEO973JMRF", "e551fb743d648ac4023f490124b8489e");
const index = client.initIndex("event_search");

exports.indexAddedEvent = functions.firestore
  .document("events/{eventId}")
  .onCreate((snap, context) => {
    const data = snap.data();
    const objectID = snap.id;

    return index.addObject({
      objectID,
      ...data
    });
  });

exports.unindexDeletedEvent = functions.firestore
  .document("events/{eventId}")
  .onDelete((snap, context) => {
    const objectID = snap.id;
    return index.deleteObject(objectID);
  });

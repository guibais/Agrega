import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from "firebase";
import { AngularFirestore } from "@angular/fire/firestore";

export class User {
  name;
  email;
  pass;
  cpf;
}
@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private afFire: AngularFirestore
  ) {}

  doRegister(user: User) {
    console.log(user);
    return this.afAuth.auth.createUserWithEmailAndPassword(
      user.email,
      user.pass
    );
  }

  doLogin(user: User) {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.pass);
  }

  doFacebookLogin() {
    return this.afAuth.auth.signInWithRedirect(
      new firebase.auth.FacebookAuthProvider()
    );
  }

  isLoggedIn() {
    var promise = new Promise((resolve, reject) => {
      this.afAuth.authState.subscribe(res => {
        if (res && res.uid) {
          console.log("user is logged in");
          resolve(true);
        } else {
          console.log("user not logged in");
          resolve(false);
        }
      });
    });

    return promise;
  }

  saveUserData(user: User) {
    const currentUser = this.afAuth.auth.currentUser;

    return this.afFire
      .collection(`users`)
      .doc(currentUser.uid)
      .set({
        name: user.name,
        email: user.email,
        cpf: user.cpf
      });
  }

  getUserData() {
    const currentUser = this.afAuth.auth.currentUser;

    return this.afFire
      .collection(`users`)
      .doc(currentUser.uid)
      .get();
  }

  verifyInfos() {
    const currentUser = this.afAuth.auth.currentUser;
    return this.afFire
      .collection("users")
      .doc(currentUser.uid)
      .get();
  }

  getEmail() {
    return this.afAuth.user;
  }

  getUser() {
    return this.afAuth.auth.currentUser;
  }

  resetPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  Logout() {
    return this.afAuth.auth.signOut();
  }
}

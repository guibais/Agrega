import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EventService } from "src/app/services/event/event.service";
import {
  ToastController,
  AlertController,
  NavController
} from "@ionic/angular";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import {
  FileTransfer,
  FileTransferObject
} from "@ionic-native/file-transfer/ngx";
import { File } from "@ionic-native/file/ngx";
import { LoadingService } from "src/app/utils/loading.service";
import { LocalNotifications } from "@ionic-native/local-notifications/ngx";
import { ActionSheetController } from "@ionic/angular";
import * as dateFns from "date-fns";

@Component({
  selector: "app-event",
  templateUrl: "./event.page.html",
  styleUrls: ["./event.page.scss"]
})
export class EventPage implements OnInit {
  event;
  identity;
  isInterested: boolean = false;
  InterestedUsers = 0;
  isPastEvent: boolean = false;
  isOwner: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private toast: ToastController,
    private socialSharing: SocialSharing,
    private iab: InAppBrowser,
    private transfer: FileTransfer,
    private file: File,
    private loading: LoadingService,
    private localNotifications: LocalNotifications,
    public actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private navCtrl: NavController,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadEvent(null);
  }

  ionViewDidEnter() {}

  loadEvent(event) {
    this.route.params.subscribe(params => {
      this.eventService.getEventsFromUser().subscribe(querySnapshot => {
        querySnapshot.docs.forEach(documentSnapshot => {
          this.isOwner = this.isOwner
            ? this.isOwner
            : params["id"] == documentSnapshot.id;
        });
      });
      this.eventService
        .getEventLive(params["id"])
        .subscribe((documentSnapshot: any) => {
          let data = documentSnapshot;
          this.event = {
            Id: params["id"],
            ...data
          };
          const diffDays = dateFns.differenceInCalendarDays(
            this.event.finalDate,
            new Date()
          );
          if (diffDays < 0) this.isPastEvent = true;
          this.event.Description = this.event.Description.split("\\n")
            .join("<br/>")
            .split('"')
            .join("");
        });
      this.eventService
        .getEventUser(params["id"])
        .subscribe(documentSnapshot => {
          if (documentSnapshot.data()) {
            this.isInterested = documentSnapshot.data().Interest;
          } else {
            this.isInterested = false;
          }
        });
      this.eventService.getInterests(params["id"]).subscribe(querySnapshot => {
        this.InterestedUsers = querySnapshot.length;
      });
    });
  }
  toggleInterest() {
    this.route.params.subscribe(params => {
      this.eventService
        .setEventInterest(
          params["id"],
          !this.isInterested,
          this.event.Date,
          this.identity ? this.identity : ""
        )
        .then(data => {
          if (!this.isInterested) {
            this.presentToast(
              "O evento foi adicionado a sua lista de interesses!"
            );
          }

          if (this.isInterested) {
            this.presentToast(
              "O evento foi removido da sua lista de interesses!"
            );
          }

          this.loadEvent(null);
        })
        .catch(err => console.log(err));
    });
  }

  async presentAlertDocument() {
    if (this.event.hasId && !this.isInterested) {
      const alert = await this.alertController.create({
        header: "Matrícula",
        message: "Matrícula para inscrição (não obrigatório)",
        inputs: [
          {
            name: "identity",
            type: "text",
            placeholder: "Número da Matrícula"
          }
        ],
        buttons: [
          {
            text: "Cancelar",
            role: "cancel"
          },
          {
            text: "Confirmar",
            handler: data => {
              this.identity = data.identity;
              this.toggleInterest();
            }
          }
        ]
      });

      await alert.present();
    } else {
      this.toggleInterest();
    }
  }

  async presentToast(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  async shareEvent() {
    var load = await this.loading.Init();

    await load.present();
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer
      .download(
        this.event.imagePath,
        this.file.cacheDirectory + this.event.Title + ".jpg"
      )
      .then(
        entry => {
          load.dismiss();
          this.socialSharing
            .share(
              `Venha para o evento ${
                this.event.Title
              }, você não pode perder! Agregue-se! `,
              `Venha para o evento ${
                this.event.Title
              }, você não pode perder! Agregue-se! `,
              entry.toURL(),
              `https://agrega.app`
            )
            .then(result => {
              console.log("Share completed? " + result.completed);
              console.log("Shared to app: " + result.app);
            })
            .catch(err => {
              console.log("Sharing failed with message: " + err);
            });
        },
        error => {
          alert(error);
        }
      );
  }

  openUrl() {
    if (!this.event.Url.toLowerCase().startsWith("http://"))
      this.event.Url = "http://" + this.event.Url;
    this.iab.create(this.event.Url, "_system");
  }

  async presentAlertDelete() {
    const alert = await this.alertController.create({
      header: "Confirmar",
      message: "Você realmente deseja <strong>DELETAR</strong> esse evento?!",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary"
        },
        {
          text: "Sim",
          handler: () => {
            this.eventService.deleteEvent(this.event.Id).then(data => {
              this.presentToast("Evento Deletado com Sucesso!");
              this.navCtrl.goBack();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async presentActionSheet() {
    let buttons: Array<Object> = [];
    buttons.push({
      text: "Compartilhar",
      icon: "share",
      cssClass: "EditionIcon",
      handler: () => {
        this.shareEvent();
      }
    });
    buttons.push({
      text: "Mais Informações",
      icon: "information-circle-outline",
      cssClass: "EditionIcon",
      handler: () => {
        this.openUrl();
      }
    });
    if (this.isOwner) {
      buttons.push(
        {
          text: "Editar",
          icon: "create",
          cssClass: "EditionIcon",
          handler: () => {
            this.router.navigate(["event/edit", this.event.Id]);
          }
        },
        {
          text: "Excluir",
          role: "destructive",
          icon: "trash",
          cssClass: "EditionIcon",
          handler: () => {
            this.presentAlertDelete();
          }
        }
      );
    }
    const actionSheet = await this.actionSheetController.create({
      header: "Ações do Evento",
      buttons: [
        ...buttons,
        {
          text: "Cancelar",
          icon: "close",
          cssClass: "EditionIcon",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    await actionSheet.present();
  }
}

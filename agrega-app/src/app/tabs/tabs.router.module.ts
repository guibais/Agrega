import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "tabs",
    component: TabsPage,
    children: [
      {
        path: "tab1",
        children: [
          {
            path: "",
            loadChildren: "./tab1/tab1.module#Tab1PageModule"
          },
          {
            path: "event/:id",
            loadChildren: "../events/event/event.module#EventPageModule"
          }
        ]
      },
      {
        path: "tab2",
        children: [
          {
            path: "",
            loadChildren: "./tab2/tab2.module#Tab2PageModule"
          },
          {
            path: "category/:name",
            loadChildren:
              "../events/event-category/event-category.module#EventCategoryPageModule"
          },
          {
            path: "event/:id",
            loadChildren: "../events/event/event.module#EventPageModule"
          }
        ]
      },
      {
        path: "tab3",
        children: [
          {
            path: "",
            loadChildren: "./tab3/tab3.module#Tab3PageModule"
          },
          {
            path: "event/:id",
            loadChildren: "../events/event/event.module#EventPageModule"
          }
        ]
      },
      {
        path: "special",
        children: [
          {
            path: "",
            loadChildren: "./special/special.module#SpecialPageModule"
          },
          {
            path: "event/:id",
            loadChildren: "../events/event/event.module#EventPageModule"
          }
        ]
      },
      {
        path: "events",
        children: [
          {
            path: "",
            loadChildren: "./events/events.module#EventsPageModule"
          },
          {
            path: "event/:id",
            loadChildren: "../events/event/event.module#EventPageModule"
          }
        ]
      },
      {
        path: "",
        redirectTo: "/tabs/tab1",
        pathMatch: "full"
      },
      {
        path: "event/:id",
        loadChildren: "../events/event/event.module#EventPageModule"
      }
    ]
  },
  {
    path: "",
    redirectTo: "/tabs/tab1",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}

import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AdminView from "../views/AdminView.vue";
import NoAuthView from "../views/NoAuthView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminView,
    meta: {
      access: "admin",
    },
  },
  {
    path: "/noAuth",
    name: "NoAuth",
    component: NoAuthView,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

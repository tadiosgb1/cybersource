import { createRouter, createWebHistory } from "vue-router";
import Home from '../views/opened/landing/Home.vue'
import Subscription from '../views/opened/landing/AlphaPMS.vue'
import Festival from '../views/opened/landing/Festival.vue'
import Onboard from "../views/opened/landing/WegagenMerchantBoarding.vue"
import Remitance from   '../views/opened/landing/Remitance.vue'

import Hosted from "../views/opened/landing/payments methods/hosted.vue"
import Silent from "../views/opened/landing/payments methods/silent.vue"
import UnifiedM from "../views/opened/landing/payments methods/unifiedm.vue"
import RestApi from "../views/opened/landing/payments methods/RestApi.vue"
import Resttransactions from "../views/opened/landing/payments methods/resttranasactions.vue"
import RestApi1 from "../views/opened/landing/payments methods/rest1.vue"
import Sdk from "../views/opened/landing/payments methods/sdk.vue"

import Unified from "../views/opened/landing/payments methods/unified.vue"


import Login from '../views/opened/auth/login.vue'
import ResetPassword from '../views/opened/auth/ResetPassword.vue'
import ForgotPasssword from '../views/opened/auth/forgotPassword.vue'
import ActivateEmailMessage from '../views/opened/landing/activateEmailMessage.vue'
import Registration from '../views/opened/auth/login.vue'
import ForgotPassword from '../views/opened/auth/forgotPassword.vue';
import Reset from '../views/opened/auth/reset.vue';
import AccessDenied from "../views/opened/auth/accessDenied.vue";

const routes = [
  {
    path: "/", name: "/",
    component: Home,
    meta:
      { requiresGuest: true }
  },

  {
    path: "/login", name: "login",
    component: Login,
    meta:
      { requiresGuest: true }
  },

   {
    path: "/subs", name: "subs",
    component: Subscription,
    meta:
      { requiresGuest: true }
  },


    {
    path: "/festival", name: "Festival",
    component: Festival,
    meta:
      { requiresGuest: true }
     },


      {
    path: "/remitance", name: "remitance",
    component: Remitance,
    meta:
      { requiresGuest: true }
     },

     

      {
    path: "/hosted", name: "hosted",
    component: Hosted,
    meta:
      { requiresGuest: true }
     },

   {
    path: "/silent", name: "silent",
    component: Silent,
    meta:
      { requiresGuest: true }
     },

{
    path: "/unim", name: "unim",
    component: UnifiedM,
    meta:
      { requiresGuest: true }
     },
     

     {
    path: "/unified", name: "unified",
    component: Unified,
    meta:
      { requiresGuest: true }
     },

{
    path: "/rest", name: "rest",
    component: RestApi,
    meta:
      { requiresGuest: true }
     },
{
    path: "/rest-tr", name: "rest-tr",
    component: Resttransactions,
    meta:
      { requiresGuest: true }
     },

     {
    path: "/rest1", name: "rest1",
    component: RestApi1,
    meta:
      { requiresGuest: true }
     },


     {
    path: "/sdk", name: "sdk",
    component: Sdk,
    meta:
      { requiresGuest: true }
     },


       {
    path: "/onboard", name: "onboard",
    component: Onboard,
    meta:
      { requiresGuest: true }
     },


  {
    path: "/register", name: "register",
    component: Registration,
    meta:
      { requiresGuest: true }
  },

  {
    path: "/email-activate-message", name: "email-activate-message",
    component: ActivateEmailMessage,
    meta:
      { requiresGuest: true }
  },
  // router/index.js
   {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasssword,
    props: true
  },
    {
      path: "/:lang/reset-password",
      name: "ResetPassword",
      component: ResetPassword,
      props: true, // passes route params as props
    },

  
  // {
  //   path: "/dashboard", name: "dashboard",
  //   component: dashboard,
  //   meta:
  //     { requiresGuest: true },
  //   children: [

      
  // ]
  // },
  { path: "/forgot-password", name: "forgotPassword", component: ForgotPassword },
  { path: "/reset/:token", name: "reset", component: Reset, meta: { requiresGuest: true } },
  { path: "/:pathMatch(.*)*", name: "accessDenied", component: AccessDenied, meta: { requiresGuest: true } },
];

const router = createRouter({
  // mode: 'hash',
  history: createWebHistory(),
  routes, // ✅ no spread needed
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const requiredRole = to.meta.role;

  if (requiresAuth) {
    if (!isAuthenticated) {
      next("/login");
    } else if (requiredRole && userRole !== requiredRole) {
      localStorage.clear();
      next("/login");
    } else {
      next();
    }
  } else if (requiresGuest) {
    next();
  } else {
    next();
  }
});

export default router;

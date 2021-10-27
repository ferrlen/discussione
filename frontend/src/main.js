import Vuelidate from "vuelidate";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "@/store.ts";
import "./main.css";

createApp(App).use(store).use(Vuelidate).use(router).mount("#app");

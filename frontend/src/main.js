import Vuelidate from "vuelidate";
import { createApp } from "vue";
import App from "./App.vue";
import routes from "./router/routes.js";
import store from "@/store.ts";
import "./main.css";

const app = createApp(App).use(store).use(Vuelidate).use(routes);
app.mount("#app");

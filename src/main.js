import { createApp } from "vue";
import App from "./App.vue";
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import Pinia Store */
import { createPinia } from "pinia";
/* import specific icons */
import { faUserSecret, faBars, faArrowsRotate, faDroplet, faGear } from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(faUserSecret, faBars, faArrowsRotate, faDroplet, faGear);
const pinia = createPinia({
  devtools: true, // Aktivieren Sie die Pinia Devtools
});
const app = createApp(App);
// app.use(VueAxios, axios)
app.use(pinia);
// app.component("pagination", Pagination);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");

import { createApp } from 'vue'
import './assets/tailwind.css'
import App from './App.vue'

// import axios from 'axios'
// import VueAxios from 'vue-axios'
import Pagination from 'v-pagination-3';


const app = createApp(App)
// app.use(VueAxios, axios)
app.component('pagination', Pagination);
app.mount('#app')
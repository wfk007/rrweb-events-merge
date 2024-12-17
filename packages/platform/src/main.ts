import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import 'rrweb-player/dist/style.css';
import { createPinia } from 'pinia';

const pinia = createPinia()

createApp(App).use(ElementPlus).use(pinia).mount("#app");

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// @ts-ignore
import vSelect from "vue-select";

Vue.component("vue-select", vSelect);

import "vue-select/dist/vue-select.css";
import vuetify from "./plugins/vuetify";
Vue.config.productionTip = false;

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount("#app");

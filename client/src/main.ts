import Vue from 'vue';
import App from './App.vue';
import router from './router';
import 'reflect-metadata';
import { CombinedVueInstance } from 'vue/types/vue';

Vue.config.productionTip = false;``

new Vue({
  router,
  render: (h: any): CombinedVueInstance<any, any, any, any, any> => h(App)
}).$mount('#app');

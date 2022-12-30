import { createApp, h } from 'vue';
import App from './App.vue';
import vuetify from './vuetify.js';

const myApp = createApp({
  name: 'RootApp',
  render()
  {
    return h(App);
  }
});

myApp.config.productionTip = false;
myApp.config.performance = false; // process.env.NODE_ENV !== 'production';
myApp.config.devtools = process.env.NODE_ENV !== 'production';

myApp.use(vuetify);
myApp.mount('#app');

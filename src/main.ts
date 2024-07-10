import { createApp } from 'vue'
import App from './App.vue'

import { WebR } from 'webr';

import './assets/main.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

const app = createApp(App);
app.use(PrimeVue, {
	theme: {
		preset: Aura
	}
});
app.config.globalProperties.webR = new WebR();
app.mount('#app');

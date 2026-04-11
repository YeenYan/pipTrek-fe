import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Global styles — Tailwind + design system tokens
import './styles/main.css'

// Dark mode is default — only remove if user explicitly chose light
const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'light') {
  document.documentElement.classList.remove('dark')
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

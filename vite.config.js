import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// const baseURL = 'https://task-manager-api-ywz0.onrender.com' //api base url hosted on render.com 
const baseURL = '' //api base url hosted on render.com 
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
  "/api/v1/tasks": {
    target: baseURL, //'http://localhost:3000/'
    changeOrigin: true,
    secure: false,
    ws: true
  },
  "/api/v1/schema": {
    target: baseURL,
    changeOrigin: true,
    secure: false,
    ws: true
  }
}},
  plugins: [react()],
})
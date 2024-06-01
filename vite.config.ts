import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:9092,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9091', //目标url
        changeOrigin: true, //支持跨域
        rewrite: (path) => path.replace(/^\/api/, ""), 
          //重写路径,替换/api
      }
    }
  }
})
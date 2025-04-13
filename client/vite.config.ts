/*
 * @Author: BuXiongYu
 * @Date: 2025-04-11 18:44:43
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-11 19:19:05
 * @Description: 请填写简介
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Generate source maps for easier debugging
    sourcemap: true,
    // Ensure assets are properly linked when served from the server
    assetsDir: 'assets',
    // Output to dist folder
    outDir: 'dist',
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
    },
  },
})

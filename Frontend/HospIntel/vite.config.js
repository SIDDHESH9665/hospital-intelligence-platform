import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5002', // Changed from 8000 to 5002 to match FastAPI backend
        changeOrigin: true,
        secure: false,
      }
    },
    fs: {
      strict: false,
      allow: ['..']
    },
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [
        { from: /^\/hospital-profiling.*/, to: '/index.html' },
        { from: /^\/hospital-impact-analysis.*/, to: '/index.html' },
        { from: /^\/hospital-due-diligence.*/, to: '/index.html' },
        { from: /./, to: '/index.html' }
      ]
    }
  }
});
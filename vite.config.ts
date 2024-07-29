import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './assets'),
    },
  },
  plugins: [
    react(),
  ],
  root: path.resolve('./src'),
  build: {
    outDir: path.resolve('./dist'),
  },
  base: '/keeb',
  server: {
    host: true,
  },
});

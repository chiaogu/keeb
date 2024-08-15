import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './assets'),
    },
  },
  plugins: [react()],
  root: path.resolve('./src'),
  build: {
    outDir: path.resolve('./dist'),
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, './src/index.html'),
        404: path.resolve(__dirname, './src/404.html'),
      },
    },
  },
  base: '/keeb',
  server: {
    host: true,
  },
});

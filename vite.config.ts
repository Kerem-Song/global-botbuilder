import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import pages from 'vite-plugin-pages';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pages()],
});

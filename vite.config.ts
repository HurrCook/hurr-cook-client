import { defineConfig } from 'vite';
// @ts-expect-error: vite plugin-react type not recognized by TS
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
});

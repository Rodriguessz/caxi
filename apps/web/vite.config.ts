import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Em `npm run dev` fora do Docker, /api é encaminhado à API local (mesmo papel do nginx e do CloudFront).
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:3000' } },
});

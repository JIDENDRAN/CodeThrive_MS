import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/", 
  
  server: {
    host: true,         // allow access from network
    port: 5173,         // your dev server port
    strictPort: true,   // fail if port is in use
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok-free.app', // allow all Ngrok free subdomains
      '.ngrok-free.dev',
       
    ]
  }
});

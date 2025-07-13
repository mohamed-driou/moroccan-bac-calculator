import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path"; // Correct import from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["n5m7p3-5173.csb.app"],
  },
  build: {
    minify: false,
  },
  resolve: {
    alias: {
      // Using resolve for proper path handling
      'react-router-dom': resolve(__dirname, 'node_modules/react-router-dom'),
      '@': resolve(__dirname, 'src') // Optional but recommended
    }
  }
});
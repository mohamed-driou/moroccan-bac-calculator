// Moroccan Baccalaureate Average Calculator - Vite Configuration
// Copyright (c) 2024 Mohamed Driou
// @license MIT

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["n5m7p3-5173.csb.app"],
  },
  build: {
    minify: false, // This ensures comments are preserved
  },
});

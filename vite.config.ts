import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["n5m7p3-5173.csb.app"], // ✅ Add your sandbox host here
    // You can also use: allowedHosts: ['*'] for development only
  },
});

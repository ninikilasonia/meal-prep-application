import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Dev-only proxy: the frontend calls same-origin "/api/*" and Vite forwards
    // to the FastAPI backend. This avoids browser CORS during local development
    // without changing any backend code. With VITE_API_BASE_URL=/api, a call to
    // "/api/ingredients" is proxied to "http://localhost:8000/ingredients".
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

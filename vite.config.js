import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Usar 'automatic' para evitar bundlear react-jsx-runtime
      jsx: 'automatic',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "MapCore",
      fileName: (format) => `map-core.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      // No externalizar maplibre-gl para que se bundlee en el paquete
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});

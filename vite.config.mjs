import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
    // This changes the out put dir from dist to build
    // comment this out if that isn't relevant for your project
    build: {
      outDir: "build",
      chunkSizeWarningLimit: 5000,
    },
    plugins: [tsconfigPaths(), react(), tagger(), visualizer({ open: true })],
    server: {
      port: "4028",
      host: "0.0.0.0",
      strictPort: true,
      // allowedHosts: ['localhost'],
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
        },
      },
  },
});
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "rrweb-events-merge",
      fileName: (format) => `rrweb-events-merge.${format}.js`,
    },
    rollupOptions: {
      external: ["rrweb", "rrweb-snapshot"],
      output: {
        globals: {
          "rrweb": "rrweb",
          "rrweb-snapshot": "rrwebSnapshot",
        },
      },
    },
    outDir: resolve(__dirname, "lib"),
  },
});

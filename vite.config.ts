import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";

function generateManifest() {
  const manifest = readJsonFile("src/manifest.json");
  const pkg = readJsonFile("package.json");
  const name = "English-to-English Definitions - Merriam-Webster Dictionary";
  const description = "Find precise English-to-English definitions effortlessly and for free with this intuitive dictionary extension.";
  return {
    name,
    description,
    version: pkg.version,
    ...manifest
  };
}

const target = process.env.TARGET || "chrome";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __BROWSER__: JSON.stringify(target)
  },
  server: {
    watch: {
      usePolling: true
    }
  },
  plugins: [
    react(),
    webExtension({
      browser: target,
      skipManifestValidation: true,
      manifest: generateManifest,
      webExtConfig: {
        startUrl: [
          "https://github.com/behnamazimi/merriam-webster-dictionary-extension.git"
        ],
        target: "chromium"
      },
      additionalInputs: ["src/ui/entrypoints/content-iframe.html"]
    })
  ]
});

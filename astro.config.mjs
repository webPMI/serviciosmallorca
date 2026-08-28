// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    imageService: "passthrough",
  }),
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en", "ca", "de"],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ["astro:middleware", "astro_middleware", "virtual:astro*"],
    },
    ssr: {
      external: ["node:async_hooks"],
    },
  },
});

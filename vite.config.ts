import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: false,

  vite: {
    base: "/palace-spice-journey/",
  },

  tanstackStart: {
    prerender: {
      enabled: true,
      crawlLinks: true,
    },
  },
});

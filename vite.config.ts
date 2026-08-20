import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// O GitHub Pages serve o site num subcaminho (/palace-spice-journey/), mas o
// preview e a publicação do Lovable servem na raiz. Só aplicamos o subcaminho
// quando o workflow do Pages define a variável.
const base = process.env["GITHUB_PAGES_BASE"] ?? "/";

export default defineConfig({
  nitro: false,

  vite: {
    base,
  },

  tanstackStart: {
    prerender: {
      enabled: true,
      crawlLinks: true,
    },
  },
});

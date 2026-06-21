export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "@nuxt/content"],
  css: ["~/assets/css/main.css", "katex/dist/katex.min.css"],

  colorMode: {
    preference: "system",
    fallback: "light",
    storage: "localStorage",
  },

  content: {
    _localDatabase: {
      type: "sqlite",
      filename:
        process.env.NUXT_CONTENT_DB_PATH ?? ".data/content/contents.sqlite",
    },
    build: {
      markdown: {
        toc: { depth: 2, searchDepth: 2 },
        remarkPlugins: { "remark-math": {} },
        rehypePlugins: { "rehype-katex": {} },
      },
    },
    experimental: { sqliteConnector: "native" },
  },

  app: {
    head: {
      htmlAttrs: { lang: "en" },
      title: "LVA TL;DR",
      meta: [
        {
          name: "description",
          content: "Compact interactive learning notes for LVAs.",
        },
        { name: "color-scheme", content: "light dark" },
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },
});

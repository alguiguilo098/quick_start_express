import { defineConfig } from 'vitepress'

export default defineConfig({
  base: "/qse/",
  title: "Quick Start Express",
  titleTemplate: ':title | QSE',
  description: "A tool to generate Express templates",
  cleanUrls: true,

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/getting-started' }
    ],
    search: {
      provider: 'local',
      placeholder: 'Search',
    },
    sidebar: [
      {
        text: 'Docs',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Setup', link: '/setup' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/CSE-25/quick_start_express' }
    ]
  },
})

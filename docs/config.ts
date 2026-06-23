import { defineAdditionalConfig, type DefaultTheme } from 'vitepress'

export default defineAdditionalConfig({
  description: 'EveryoneTrust SSL/TLS certificate documentation.',

  themeConfig: {
    nav: nav(),

    sidebar: {
      '/guide/': { base: '/guide/', items: sidebarGuide() }
    },

    footer: {
      message: 'EveryoneTrust SSL documentation for secure HTTPS operations.',
      copyright: 'Copyright © 2024-2026 EveryoneTrust'
    }
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Guides',
      link: '/guide/getting-started',
      activeMatch: '/guide/'
    },
    {
      text: 'Validation',
      link: '/guide/domain-validation'
    },
    {
      text: 'Deployment',
      link: '/guide/deployment'
    },
    {
      text: 'Console',
      link: 'https://shop.ywxmz.com/console/'
    },
    {
      text: 'Website',
      items: [
        {
          text: 'Pricing',
          link: 'https://shop.ywxmz.com/price.html'
        },
        {
          text: 'Certificate Check',
          link: 'https://shop.ywxmz.com/tool/check.html'
        },
        {
          text: 'Contact',
          link: 'https://shop.ywxmz.com/contact.html'
        }
      ]
    }
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'EveryoneTrust SSL',
      collapsed: false,
      items: [
        { text: 'Getting Started', link: 'getting-started' },
        { text: 'Domain Validation', link: 'domain-validation' },
        { text: 'Certificate Deployment', link: 'deployment' },
        { text: 'Automation', link: 'automation' }
      ]
    }
  ]
}

import { defineAdditionalConfig, type DefaultTheme } from 'vitepress'

export default defineAdditionalConfig({
  description: 'EveryoneTrust SSL/TLS 证书购买、验证、部署、续期和自动化运维文档。',

  themeConfig: {
    nav: nav(),

    sidebar: {
      '/guide/': { base: '/guide/', items: sidebarGuide() }
    },

    footer: {
      message: 'EveryoneTrust SSL 文档中心，帮助你稳定完成 HTTPS 运维。',
      copyright: '版权所有 © 2024-2026 EveryoneTrust'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    notFound: {
      title: '页面未找到',
      quote: '这里暂时没有对应内容，请返回首页或从导航重新选择文档。',
      linkLabel: '前往首页',
      linkText: '带我回首页'
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳转到内容'
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: '指南',
      link: '/guide/getting-started',
      activeMatch: '/guide/'
    },
    {
      text: '域名验证',
      link: '/guide/domain-validation'
    },
    {
      text: '部署',
      link: '/guide/deployment'
    },
    {
      text: '控制台',
      link: 'https://shop.ywxmz.com/console/'
    },
    {
      text: '官网',
      items: [
        {
          text: '证书价格',
          link: 'https://shop.ywxmz.com/price.html'
        },
        {
          text: '证书检测',
          link: 'https://shop.ywxmz.com/tool/check.html'
        },
        {
          text: '联系我们',
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
        { text: '快速开始', link: 'getting-started' },
        { text: '域名验证', link: 'domain-validation' },
        { text: '证书部署', link: 'deployment' },
        { text: '自动化管理', link: 'automation' }
      ]
    }
  ]
}

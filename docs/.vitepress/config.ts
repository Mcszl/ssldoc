import {
  defineConfig,
  resolveSiteDataByRoute,
  type HeadConfig
} from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin
} from 'vitepress-plugin-group-icons'
import llmstxt from 'vitepress-plugin-llms'

const prod = !!process.env.NETLIFY
const siteUrl = 'https://shop.ywxmz.com'
const logoUrl = 'https://cos-ssldoc.ywxmz.com/spaceFiles/1/nS3DUXtiobRsMPxGnTNDzt.png'

const ogImage = logoUrl

const localeToOgLocaleMap: Record<string, string> = {
  root: 'en_US',
  zh: 'zh_CN',
  pt: 'pt_BR',
  ru: 'ru_RU',
  es: 'es_ES',
  ko: 'ko_KR',
  fa: 'fa_IR',
  ja: 'ja_JP'
}

export default defineConfig({
  title: 'EveryoneTrust SSL 文档',
  description: 'EveryoneTrust SSL/TLS 证书购买、验证、部署、续期和自动化运维文档。',

  rewrites: {
    'en/:rest*': ':rest*'
  },

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  markdown: {
    math: true,
    codeTransformers: [
      // We use `[!!code` and `@@include` in demo to prevent transformation,
      // here we revert it back.
      {
        postprocess(code) {
          return code
            .replaceAll('[!!code', '[!code')
            .replaceAll('@@include', '@include')
        }
      }
    ],
    config(md) {
      // Keep the copy-button title localized while the renderer output stays static.
      const fence = md.renderer.rules.fence!
      md.renderer.rules.fence = function (tokens, idx, options, env, self) {
        const { localeIndex = 'root' } = env
        const codeCopyButtonTitle = (() => {
          switch (localeIndex) {
            case 'es':
              return 'Copiar código'
            case 'fa':
              return 'کپی کد'
            case 'ko':
              return '코드 복사'
            case 'pt':
              return 'Copiar código'
            case 'ru':
              return 'Скопировать код'
            case 'zh':
              return '复制代码'
            case 'ja':
              return 'コードをコピー'
            default:
              return 'Copy code'
          }
        })()
        return fence(tokens, idx, options, env, self).replace(
          '<button title="Copy Code" class="copy"></button>',
          `<button title="${codeCopyButtonTitle}" class="copy"></button>`
        )
      }
      md.use(groupIconMdPlugin)
    }
  },

  sitemap: {
    hostname: siteUrl,
    transformItems(items) {
      return items.filter((item) => !item.url.includes('migration'))
    }
  },

  // prettier-ignore
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: logoUrl }],
    ['meta', { name: 'theme-color', content: '#2563eb' }]
  ],

  themeConfig: {
    logo: { src: logoUrl, width: 24, height: 24, alt: 'EveryoneTrust SSL' },

    search: {
      provider: 'local'
    }
  },

  locales: {
    root: { label: 'English', lang: 'en-US', dir: 'ltr' },
    zh: { label: '简体中文', lang: 'zh-Hans', dir: 'ltr' },
    pt: { label: 'Português', lang: 'pt-BR', dir: 'ltr' },
    ru: { label: 'Русский', lang: 'ru-RU', dir: 'ltr' },
    es: { label: 'Español', lang: 'es', dir: 'ltr' },
    ko: { label: '한국어', lang: 'ko-KR', dir: 'ltr' },
    fa: { label: 'فارسی', lang: 'fa-IR', dir: 'rtl' },
    ja: { label: '日本語', lang: 'ja', dir: 'ltr' }
  },

  vite: {
    plugins: [
      groupIconVitePlugin(),
      prod && llmstxt({ workDir: 'en', ignoreFiles: ['index.md'] })
    ],
    experimental: {
      enableNativePlugin: true
    }
  },

  // prettier-ignore
  transformPageData: prod ? (pageData, ctx) => {
    const url = new URL(pageData.relativePath.replace(/(?:(^|\/)index)?\.md$/, '$1'), siteUrl).href
    const site = resolveSiteDataByRoute(ctx.siteConfig.site, pageData.relativePath)
    const title = pageData.title ? `${pageData.title} | EveryoneTrust SSL` : site.title
    const description = pageData.description || site.description
    const locale = localeToOgLocaleMap[site.localeIndex || 'root']

    ;((pageData.frontmatter.head ??= []) as HeadConfig[]).push(
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:locale', content: locale }],
      ['meta', { property: 'og:site_name', content: 'EveryoneTrust SSL 文档' }],
      ['meta', { property: 'og:image', content: ogImage }],
      ['meta', { property: 'og:image:secure_url', content: ogImage }],
      ['meta', { property: 'og:image:type', content: 'image/png' }],
      ['meta', { property: 'og:image:alt', content: 'EveryoneTrust SSL 文档' }],
      ['link', { rel: 'canonical', href: url }]
    )
  } : undefined
})

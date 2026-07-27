import fs from 'fs-extra'
import matter from 'gray-matter'
import path from 'node:path'
import type {
  EnumChangefreq,
  Img,
  LinkItem,
  NewsItem
} from 'sitemap'
import type { SiteConfig } from '../config'
import { slash } from '../shared'
import { getGitTimestamp } from '../utils/getGitTimestamp'
import { task } from '../utils/task'

export async function generateSitemap(siteConfig: SiteConfig) {
  const sitemap = siteConfig.sitemap
  if (!sitemap?.hostname) return

  const getLastmod = async (url: string) => {
    if (!siteConfig.lastUpdated) return undefined

    let file = url.replace(/(^|\/)$/, '$1index')
    file = file.replace(/(\.html)?$/, '.md')
    file = siteConfig.rewrites.inv[file] || file
    file = path.join(siteConfig.srcDir, file)

    if (!fs.existsSync(file)) return undefined

    const { data } = matter.read(file)
    if (data.lastUpdated === false) return undefined
    if (data.lastUpdated instanceof Date) return +data.lastUpdated

    return (await getGitTimestamp(slash(file))) || undefined
  }

  await task('generating sitemap', async () => {
    const locales = siteConfig.userConfig.locales || {}
    const filteredLocales = Object.keys(locales).filter(
      (locale) => locales[locale].lang && locale !== 'root'
    )
    const defaultLang =
      locales?.root?.lang || siteConfig.userConfig.lang || 'en-US'

    const pages = siteConfig.pages.map(
      (page) => siteConfig.rewrites.map[page] || page
    )

    const groupedPages: Record<string, { lang: string; url: string }[]> = {}
    pages.forEach((page) => {
      const locale = page.split('/')[0]
      const lang = locales[locale]?.lang || defaultLang

      let url = page.replace(/(^|\/)index\.md$/, '$1')
      url = url.replace(/\.md$/, siteConfig.cleanUrls ? '' : '.html')
      if (filteredLocales.includes(locale)) page = page.slice(locale.length + 1)

      if (!groupedPages[page]) groupedPages[page] = []
      groupedPages[page].push({ url, lang })
    })

    const _items = await Promise.all(
      Object.values(groupedPages).map(async (pages) => {
        if (pages.length < 2)
          return { url: pages[0].url, lastmod: await getLastmod(pages[0].url) }

        return await Promise.all(
          pages.map(async ({ url }) => {
            return { url, lastmod: await getLastmod(url), links: pages }
          })
        )
      })
    )

    let items: SitemapItem[] = _items.flat()
    items = (await sitemap.transformItems?.(items)) || items

    const sitemapPath = path.join(siteConfig.outDir, 'sitemap.xml')
    await fs.outputFile(sitemapPath, renderSitemapXml(items, sitemap.hostname))
  })
}

function renderSitemapXml(items: SitemapItem[], hostname: string): string {
  const hasAlternates = items.some((item) => item.links?.length)
  const namespace = hasAlternates
    ? ' xmlns:xhtml="http://www.w3.org/1999/xhtml"'
    : ''
  const urls = items.map((item) => renderSitemapUrl(item, hostname)).join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${namespace}>`,
    urls,
    '</urlset>',
    ''
  ].join('\n')
}

function renderSitemapUrl(item: SitemapItem, hostname: string): string {
  const lines = [
    '  <url>',
    `    <loc>${escapeXml(toAbsoluteUrl(item.url, hostname))}</loc>`
  ]

  const lastmod = formatLastmod(item.lastmodISO || item.lastmod)
  if (lastmod) lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`)
  if (item.changefreq) lines.push(`    <changefreq>${escapeXml(item.changefreq)}</changefreq>`)
  if (item.priority !== undefined) {
    lines.push(`    <priority>${formatPriority(item.priority)}</priority>`)
  }

  for (const link of item.links || []) {
    if (!link.url || !link.lang) continue
    lines.push(
      `    <xhtml:link rel="alternate" hreflang="${escapeXml(link.lang)}" href="${escapeXml(toAbsoluteUrl(link.url, hostname))}" />`
    )
  }

  lines.push('  </url>')
  return lines.join('\n')
}

function toAbsoluteUrl(url: string, hostname: string): string {
  if (/^[a-z][a-z\d+.-]*:/i.test(url)) return url

  const base = hostname.endsWith('/') ? hostname : `${hostname}/`
  const pathname = url === '/' ? '' : url.replace(/^\/+/, '')
  return new URL(pathname, base).href
}

function formatLastmod(lastmod?: string | number | Date): string | undefined {
  if (lastmod === undefined || lastmod === null || lastmod === '') return undefined

  const date = lastmod instanceof Date ? lastmod : new Date(lastmod)
  return Number.isNaN(+date) ? undefined : date.toISOString()
}

function formatPriority(priority: number): string {
  return Math.min(1, Math.max(0, priority)).toFixed(1)
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// ============================== Patched Types ===============================

export interface SitemapItem {
  lastmod?: string | number | Date
  changefreq?: `${EnumChangefreq}`
  fullPrecisionPriority?: boolean
  priority?: number
  news?: NewsItem
  expires?: string
  androidLink?: string
  ampLink?: string
  url: string
  video?: any
  img?: string | Img | (string | Img)[]
  links?: LinkItem[]
  lastmodfile?: string | Buffer | URL
  lastmodISO?: string
  lastmodrealtime?: boolean
}

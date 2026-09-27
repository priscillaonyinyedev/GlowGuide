import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const publicRoutes = ['/', '/shop', '/brands', '/learn', '/ingredients', '/about', '/contact']

function sitemapPlugin(siteUrl) {
  return {
    name: 'glowguide-sitemap',
    apply: 'build',
    async closeBundle() {
      const dist = resolve(process.cwd(), 'dist')
      await mkdir(dist, { recursive: true })
      const origin = siteUrl ? new URL(siteUrl).origin : null
      const robots = ['User-agent: *', 'Allow: /', 'Disallow: /dashboard/', 'Disallow: /admin/']
      if (origin) {
        robots.push(`Sitemap: ${origin}/sitemap.xml`)
        const urls = publicRoutes.map((route) => `  <url><loc>${origin}${route}</loc></url>`).join('\n')
        await writeFile(resolve(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
      }
      await writeFile(resolve(dist, 'robots.txt'), `${robots.join('\n')}\n`)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), tailwindcss(), sitemapPlugin(env.VITE_SITE_URL)],
    server: {
      port: 5173,
    },
  }
})

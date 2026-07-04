export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://www.ascendrix.co/sitemap.xml',
    host: 'https://www.ascendrix.co',
  }
}

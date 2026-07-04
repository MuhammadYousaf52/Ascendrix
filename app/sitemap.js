export default function sitemap() {
  const base = 'https://www.ascendrix.co'
  const now = new Date().toISOString()

  return [
    { url: base,                   lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/#about`,       lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/#services`,    lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/#case-studies`,lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/#book-a-call`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/#tools`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/#faqs`,        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]
}

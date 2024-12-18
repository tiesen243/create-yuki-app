import type { Metadata } from 'next'

import { getBaseUrl } from '@/lib/utils'

interface SeoParams {
  title?: string
  description?: string
  images?: string[]
  url?: string
}

export const seo = (params: SeoParams): Metadata => {
  const siteName = 'Create Yuki App'
  const title = params.title ?? siteName
  const description = params.description ?? 'Generated by create yuki app'
  const images = [...(params.images ?? []), '/api/og']
  const url = params.url ? `${getBaseUrl()}${params.url}` : getBaseUrl()

  return {
    metadataBase: new URL(getBaseUrl()),
    title,
    description,
    applicationName: siteName,
    twitter: { card: 'summary_large_image' },
    openGraph: { images, url, siteName, type: 'website' },
    icons: { icon: 'https://tiesen.id.vn/favicon.ico' },
    alternates: { canonical: url },
  }
}

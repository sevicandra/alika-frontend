import type { MetadataRoute } from 'next'
 import Icon from '@/component/Atoms/LabelIcon'
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: process.env.APP_NAME,
    short_name: 'Alk',
    description: process.env.APP_DESC,
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/img/alika.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}
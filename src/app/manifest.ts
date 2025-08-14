import type { MetadataRoute } from 'next'
export default function manifest(): MetadataRoute.Manifest {
  return {
  "id": "/",
  "name": "Alika DJKN",
  "short_name": "Alika",
  "description": "Aplikasi kesekretariatan DJKN untuk pengelolaan data, dokumen, dan layanan internal.",
  "start_url": "/?source=pwa",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#FFFFFF",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/alika-192.png",
      "sizes": "179x193",
      "type": "image/png"
    },
    {
      "src": "/icons/alika-512.png",
      "sizes": "475x512",
      "type": "image/png"
    },
    {
      "src": "/icons/alika-maskable.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
  }
}
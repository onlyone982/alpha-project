/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // 홈 화면에 설치 가능한 앱(PWA). 새 버전이 배포되면 다음에 열 때 자동으로 바뀜
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'ARC',
        short_name: 'ARC',
        description: '자기개발용 나만의 홈',
        lang: 'ko',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Firebase 로그인 처리 주소(/__/auth/...)는 앱 화면으로 바꿔치기하지 않음
        navigateFallbackDenylist: [/^\/__\//],
      },
    }),
  ],
  test: {
    environment: 'node',
  },
})

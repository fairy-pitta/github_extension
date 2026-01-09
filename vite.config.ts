import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.',
        },
        {
          src: 'public/icons/*',
          dest: 'icons',
        },
      ],
    }),
    // Plugin to copy HTML files to dist root after build and fix paths
    {
      name: 'copy-html-files',
      closeBundle() {
        const distDir = resolve(__dirname, 'dist');
        const dashboardSrc = join(distDir, 'src/presentation/dashboard/index.html');
        const dashboardDest = join(distDir, 'dashboard.html');

        // Copy and fix dashboard.html
        if (existsSync(dashboardSrc)) {
          let content = readFileSync(dashboardSrc, 'utf-8');
          // Fix relative paths - replace any path starting with ../ or / with ./
          content = content.replace(/(src|href)="(\.\.\/)+assets\//g, '$1="./assets/');
          content = content.replace(/(src|href)="\/assets\//g, '$1="./assets/');
          writeFileSync(dashboardDest, content);
        }
      },
    },
  ],
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      input: {
        dashboard: resolve(__dirname, 'src/presentation/dashboard/index.html'),
        'service-worker': resolve(__dirname, 'src/infrastructure/background/service-worker.ts'),
        'github-content': resolve(__dirname, 'src/infrastructure/content/github-content.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          const name = chunkInfo.name || '';
          if (name === 'service-worker') {
            return 'service-worker.js';
          }
          if (name === 'github-content') {
            return 'assets/github-content.js';
          }
          return 'assets/[name].js';
        },
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          // Handle HTML files - output them directly to dist root with correct names
          if (assetInfo.name && assetInfo.name.endsWith('.html')) {
            // Extract the entry name from the source path
            const source = String(assetInfo.source || '');
            if (source.includes('dashboard')) {
              return 'dashboard.html';
            }
          }
          // Handle CSS files
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            // Check if it's from github-content
            const source = String(assetInfo.source || '');
            if (source.includes('github-content') || assetInfo.name.includes('github-content')) {
              return 'assets/github-content.css';
            }
            return 'assets/[name].[ext]';
          }
          return 'assets/[name].[ext]';
        },
      },
    },
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/domain': resolve(__dirname, './src/domain'),
      '@/application': resolve(__dirname, './src/application'),
      '@/infrastructure': resolve(__dirname, './src/infrastructure'),
      '@/presentation': resolve(__dirname, './src/presentation'),
    },
  },
});


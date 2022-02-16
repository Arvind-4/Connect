import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import postcss from '../src/postcss.config'

export default defineConfig({
  root: './src',
  define: {
    'process.env': process.env
  },
  css: {
    postcss,
  },  
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^~.+/,
        replacement: (val) => {
          return val.replace(/^~/, "");
        },
      },
    ],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    outDir: '../../web/static-dev/js',
  } 
})
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import preprocess from 'svelte-preprocess';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      svelte({
        include: /\.wc\.svelte$/,
        preprocess: preprocess(),
        compilerOptions: {
          customElement: true
        }
      }),

      svelte({
        exclude: /\.wc\.svelte$/,
        preprocess: preprocess(),
        compilerOptions: {
          customElement: false
        }
      })
  ]
})

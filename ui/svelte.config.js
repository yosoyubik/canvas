import preprocess from 'svelte-preprocess';
import { optimizeCarbonImports } from 'carbon-components-svelte/preprocess/index.js';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [preprocess(), optimizeCarbonImports()],
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    files: { lib: './src/lib' },
    vite: {
      server: {
        proxy: {
          '^/~landscape/.*': {
            target: 'http://localhost:8080/',
            changeOrigin: true
          },
          '^/~/channel/.*': {
            target: 'http://localhost:8080/',
            changeOrigin: true
          },
          '^/spider/.*': {
            target: 'http://localhost:8080/',
            changeOrigin: true
          }
        },
        cors: true
      },
      build: {},
      resolve: {
        alias: {
          "./runtimeConfig": "./runtimeConfig.browser"
        }
      }
    },
    paths: { base: '/~canvas' },
    ssr: false,
    adapter: adapter({
      pages: '../urbit/app/canvas'
    })
  }
};

export default config;

import preprocess from 'svelte-preprocess';
import { optimizeImports } from 'carbon-preprocess-svelte';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [preprocess(), optimizeImports()],
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    files: { lib: './src/lib' },
    paths: { base: '/apps/canvas' },
    adapter: adapter({
      pages: 'dist'
    })
  }
};

export default config;

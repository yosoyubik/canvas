import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Urbit ship URL for development proxy
// Can be overridden with URBIT_URL environment variable
const URBIT_URL = process.env.URBIT_URL || 'http://localhost:8080';

export default defineConfig({
  plugins: [sveltekit()],

  server: {
    port: 3000,
    proxy: {
      // Proxy session.js for authentication
      '^/session.js': {
        target: URBIT_URL,
        changeOrigin: true,
        secure: false
      },
      // Proxy spider (thread) requests
      '^/spider/.*': {
        target: URBIT_URL,
        changeOrigin: true,
        secure: false
      },
      // Proxy all Urbit API endpoints (~/)
      '^/~/.*': {
        target: URBIT_URL,
        changeOrigin: true,
        secure: false,
        ws: true // Enable WebSocket proxy for SSE/channel connections
      }
    },
    cors: true
  },

  // Handle AWS SDK browser compatibility
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser'
    }
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ['lodash', 'd3', 'topojson-client']
  },

  build: {
    // Generate sourcemaps for debugging
    sourcemap: true
  }
});

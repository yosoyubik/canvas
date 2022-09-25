import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
		proxy: {
			'^/session.js': {
				target: 'http://localhost:8080/',
				changeOrigin: true,
			},
			'^/spider/.*': {
				target: 'http://localhost:8080/',
				changeOrigin: true,
			},
			'^/~/.*': {
				target: 'http://localhost:8080/',
				changeOrigin: true,
			}
		},
		cors: true,
	},
	build: {},
	resolve: {
		alias: {
			'./runtimeConfig': './runtimeConfig.browser'
		}
	}
};

export default config;
import App from './App.svelte';

window.urb = new window.channel();

const app = new App({
	target: document.body,
	props: {
		name: 'world',
	}
});

export default app;
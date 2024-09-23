import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	base: "/find-the-spy/",
	plugins: [sveltekit()]
});

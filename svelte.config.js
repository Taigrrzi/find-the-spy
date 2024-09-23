import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'



/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter(),
        paths: {
            base: process.env.NODE_ENV === 'production' ? '/find-the-spy' : '',
        }
    }
};

export default config;

// import adapter from '@sveltejs/adapter-static';

// export default {
//   kit: {
//     adapter: adapter({
//       // default options are shown. On some platforms
//       // these options are set automatically — see below
//       pages: 'docs',
//       assets: 'docs',
//       fallback: null,
//       precompress: false,
//       domain: '',
//       jekyll: false
//     })
//   }
// };
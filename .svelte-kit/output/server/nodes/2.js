import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["app/immutable/nodes/2.D3eDgICZ.js","app/immutable/chunks/scheduler.B0sifwxf.js","app/immutable/chunks/index.BhBAaEO7.js","app/immutable/chunks/paths.Dkr27BuD.js"];
export const stylesheets = ["app/immutable/assets/2.DhRaFu4A.css"];
export const fonts = [];

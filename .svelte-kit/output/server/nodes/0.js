import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["app/immutable/nodes/0.D_h-fgqc.js","app/immutable/chunks/scheduler.B0sifwxf.js","app/immutable/chunks/index.BhBAaEO7.js"];
export const stylesheets = ["app/immutable/assets/0.DnuRTPiI.css"];
export const fonts = [];

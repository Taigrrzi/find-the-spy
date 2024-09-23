import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.6p80frZt.js","_app/immutable/chunks/scheduler.BX2x-Afv.js","_app/immutable/chunks/index.CDaZcnPi.js","_app/immutable/chunks/paths.CTCgR9vE.js"];
export const stylesheets = ["_app/immutable/assets/2.DKB62vKR.css"];
export const fonts = [];

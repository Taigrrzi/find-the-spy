import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.GaQ3bJqs.js","_app/immutable/chunks/scheduler.D4L9Pt2K.js","_app/immutable/chunks/index.DV9Mk8CO.js","_app/immutable/chunks/each.ut2oM2TZ.js"];
export const stylesheets = ["_app/immutable/assets/2.DKB62vKR.css"];
export const fonts = [];

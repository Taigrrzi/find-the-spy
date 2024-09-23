import * as server from '../entries/pages/sverdle/_page.server.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/sverdle/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/sverdle/+page.server.js";
export const imports = ["_app/immutable/nodes/4.DIbKzAem.js","_app/immutable/chunks/scheduler.D4L9Pt2K.js","_app/immutable/chunks/index.DV9Mk8CO.js","_app/immutable/chunks/each.ut2oM2TZ.js","_app/immutable/chunks/entry.YGHwdkze.js"];
export const stylesheets = ["_app/immutable/assets/4.DOkkq0IA.css"];
export const fonts = [];

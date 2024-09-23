import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.CW-6exXJ.js","_app/immutable/chunks/scheduler.BX2x-Afv.js","_app/immutable/chunks/index.CDaZcnPi.js"];
export const stylesheets = ["_app/immutable/assets/0.4DT06Uf9.css"];
export const fonts = [];



export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.DviJDGuv.js","_app/immutable/chunks/scheduler.D4L9Pt2K.js","_app/immutable/chunks/index.DV9Mk8CO.js","_app/immutable/chunks/entry.YGHwdkze.js"];
export const stylesheets = [];
export const fonts = [];



export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["app/immutable/nodes/1.F7SIyT3u.js","app/immutable/chunks/scheduler.B0sifwxf.js","app/immutable/chunks/index.BhBAaEO7.js","app/immutable/chunks/entry.DE_4DWK4.js","app/immutable/chunks/paths.Dkr27BuD.js"];
export const stylesheets = [];
export const fonts = [];

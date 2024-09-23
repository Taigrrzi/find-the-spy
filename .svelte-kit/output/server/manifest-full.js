export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "find-the-spy/_app",
	assets: new Set(["autumn-sale-24-hours.jpg","build-your-own-cleanse-hero.jpg","favicon.png","favourites-52-20-orange.jpg","favourites-collagen-20-orange.jpg","favourites-juice-20-orange.jpg","favourites-soup-20-orange.jpg","logo.jpg","robots.txt","topics.json","wave-orange-green.jpg","x.nojekyll"]),
	mimeTypes: {".jpg":"image/jpeg",".png":"image/png",".txt":"text/plain",".json":"application/json"},
	_: {
		client: {"start":"_app/immutable/entry/start.CAgwwTKa.js","app":"_app/immutable/entry/app.B9XE7DPk.js","imports":["_app/immutable/entry/start.CAgwwTKa.js","_app/immutable/chunks/entry.9BDZ0l2J.js","_app/immutable/chunks/scheduler.BX2x-Afv.js","_app/immutable/chunks/paths.CTCgR9vE.js","_app/immutable/entry/app.B9XE7DPk.js","_app/immutable/chunks/scheduler.BX2x-Afv.js","_app/immutable/chunks/index.CDaZcnPi.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

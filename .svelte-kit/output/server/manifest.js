export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","logo.jpg","robots.txt","topics.json"]),
	mimeTypes: {".png":"image/png",".jpg":"image/jpeg",".txt":"text/plain",".json":"application/json"},
	_: {
		client: {"start":"_app/immutable/entry/start.-1FTLFA-.js","app":"_app/immutable/entry/app.CBaF741H.js","imports":["_app/immutable/entry/start.-1FTLFA-.js","_app/immutable/chunks/entry.YGHwdkze.js","_app/immutable/chunks/scheduler.D4L9Pt2K.js","_app/immutable/entry/app.CBaF741H.js","_app/immutable/chunks/scheduler.D4L9Pt2K.js","_app/immutable/chunks/index.DV9Mk8CO.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/4.js'))
		],
		routes: [
			{
				id: "/sverdle",
				pattern: /^\/sverdle\/?$/,
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

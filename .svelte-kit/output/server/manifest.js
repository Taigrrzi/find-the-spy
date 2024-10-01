export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "app",
	appPath: "find-the-spy/app",
	assets: new Set([".DS_Store","favicon.png","logo.jpg","robots.txt","topics.json","wave-orange-green.jpg","x.nojekyll"]),
	mimeTypes: {".png":"image/png",".jpg":"image/jpeg",".txt":"text/plain",".json":"application/json"},
	_: {
		client: {"start":"app/immutable/entry/start.CmkDAcnU.js","app":"app/immutable/entry/app.gN_pH4Xk.js","imports":["app/immutable/entry/start.CmkDAcnU.js","app/immutable/chunks/entry.DE_4DWK4.js","app/immutable/chunks/scheduler.B0sifwxf.js","app/immutable/chunks/paths.Dkr27BuD.js","app/immutable/entry/app.gN_pH4Xk.js","app/immutable/chunks/scheduler.B0sifwxf.js","app/immutable/chunks/index.BhBAaEO7.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

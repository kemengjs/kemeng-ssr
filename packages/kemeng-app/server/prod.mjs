import { createServer } from '@kemengjs/kemeng-ssr'

createServer(
	() => {},
	{
		isServeAssets: true,
		routePrefix: '/v/',
		specialRoutesToApps: {
			'h5-pp': 'h5-pp'
		}
	},
	app => {
		app.use(async (ctx, next) => {
			if (ctx.originalUrl === '/monitor/ping') {
				ctx.body = 'ok'
				return
			}
			next()
		})
	}
)

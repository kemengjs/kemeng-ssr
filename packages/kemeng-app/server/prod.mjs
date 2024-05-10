import { createServer } from '@kemengjs/kemeng-ssr'

createServer(
	() => {},
	{
		isServeAssets: true,
		routePrefix: '/v/'
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

import { createServer } from '@kemengjs/kemeng-ssr'

createServer(() => {}, {
	isServeAssets: true,
	routePrefix: '/v/',
	specialRoutesToApps: {
		'h5-pp': 'h5-pp'
	}
})

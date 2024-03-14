import { AsyncLocalStorage } from 'node:async_hooks'
import koa from 'koa'
import compress from 'koa-compress'
import fs from 'node:fs'
import KoaRouter from 'koa-router'
import { resolve } from '../utils/utils'
import staticServe from 'koa-static'

console.log('qweqweqwe')

export const createServer = async () => {
	const asyncLocalStorage = new AsyncLocalStorage()
	global._asyncLocalStorage = asyncLocalStorage

	const template = fs.readFileSync(resolve('dist/client/index.html'), 'utf8')

	const app = new koa()
	const router = new KoaRouter()
	const entryModule = await import(resolve('./dist/server/entry-server.js'))
	const { render, handleSsrData } = entryModule

	app.use(compress())

	app.use(
		staticServe(resolve('./dist/client'), {
			defer: false,
			index: 'koaIndex.html'
		})
	)

	app.use((ctx,next)=>{
		
	})

	router.get('/h5-music-detail', async ctx => {
		try {
			const { headers, query } = ctx

			const serverData = {
				headers,
				query,
				cookies: ctx.headers.cookie
			}

			await asyncLocalStorage.run(serverData, async () => {
				const ssrData = await handleSsrData(serverData)

				const appHtml = render(ssrData)
				const html = template
					.replace(
						'<!-- SSR_DATA -->',
						`<script>window.__SSR_DATA__=${JSON.stringify(
							JSON.stringify(ssrData)
						)}</script>`
					)
					.replace(`<!--app-html-->`, appHtml)

				ctx.status = 200
				ctx.type = 'html'
				ctx.body = html
			})
		} catch (error) {
			console.log(error)
			ctx.status = 500
			ctx.body = '呀！服务出了点小毛病!'
		}
	})

	app.use(router.routes())
	app.use(router.allowedMethods())
	app.listen(3000, () => {
		console.log('http://localhost:3000')
	})
}
createServer()

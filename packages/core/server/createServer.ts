import { AsyncLocalStorage } from 'node:async_hooks'
import koa from 'koa'
import compress from 'koa-compress'
import fs from 'node:fs'
import koaConnect from 'koa-connect'
import dayjs from 'dayjs'
import { appName, curAppResolve, workspaceResolve } from '../utils/utils'
import staticServe from 'koa-static'
import { initRoutesMap, routesMap } from './increase'

const handleDevApp = async (app: koa<koa.DefaultState, koa.DefaultContext>) => {
	const vite = await (
		await import('vite')
	).createServer({
		root: curAppResolve('./'),
		server: { middlewareMode: true },
		appType: 'custom',
		configFile: workspaceResolve('./vite.config.ts')
	})

	app.use(koaConnect(vite.middlewares))

	console.log(
		'root',
		curAppResolve('./'),
		'vite',
		workspaceResolve('./vite.config.ts')
	)

	app.use(async ctx => {
		try {
			const { headers, query, originalUrl, path } = ctx
			const renderContext = {
				headers,
				query,
				cookies: ctx.headers.cookie,
				path
			}

			let template = fs.readFileSync(curAppResolve('index.html'), 'utf8')
			template = await vite.transformIndexHtml(originalUrl, template)

			const entryModule = await vite.ssrLoadModule(
				curAppResolve('./renderer/entry-server.tsx')
			)
			const { render, getServerData } = entryModule

			global._asyncLocalStorage.run(renderContext, async () => {
				const curTime = dayjs()
				console.log('curTime', curTime.format())
				const serverData = await getServerData(renderContext)
				const jieTime = dayjs()
				console.log('预先请求结束', jieTime.format(), jieTime.diff(curTime))

				const appHtml = render(serverData, renderContext)
				const html = template
					.replace(
						'<!-- SERVER_DATA -->',
						`<script>window.__SERVER_DATA__=${JSON.stringify(
							JSON.stringify(serverData)
						)}</script>`
					)
					.replace(`<!--app-html-->`, appHtml)

				// if(res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
				const xuanTime = dayjs()
				console.log('渲染结束', xuanTime.format(), xuanTime.diff(jieTime))

				ctx.status = 200
				ctx.type = 'html'
				ctx.body = html
			})
		} catch (error) {
			vite.ssrFixStacktrace(error)
			console.log('error', error)
		}
	})
}
const handleProdApp = async (
	app: koa<koa.DefaultState, koa.DefaultContext>
) => {
	await initRoutesMap()

	app.use(
		staticServe(curAppResolve('./dist/client'), {
			defer: false,
			index: 'koaIndex.html'
		})
	)

	app.use(async (ctx, next) => {
		try {
			const { headers, query, path } = ctx
			const curApp = path.match(/\/([^/]*)\//)?.[1]
			const routeItem = routesMap[curApp]
			const contentType = ctx.request.headers['content-type'] || ''

			console.log('contentType', contentType)

			if (!contentType.includes('text/html') || !curApp || !routeItem) {
				await next()
				return
			}

			const { template, render, getServerData } = routesMap[curApp]

			const renderContext = {
				headers,
				query,
				cookies: ctx.headers.cookie,
				path
			}

			console.log('path', renderContext.path)

			await global._asyncLocalStorage.run(renderContext, async () => {
				const serverData = await getServerData(renderContext)

				const appHtml = render(serverData, renderContext)
				const html = template
					.replace(
						'<!-- SERVER_DATA -->',
						`<script>window.__SERVER_DATA__=${JSON.stringify(
							JSON.stringify(serverData)
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
}

export const createServer = async () => {
	const asyncLocalStorage = new AsyncLocalStorage()
	global._asyncLocalStorage = asyncLocalStorage
	const isProduction = process.env.NODE_ENV === 'production'
	const app = new koa()

	app.use(compress())

	if (isProduction) {
		await handleProdApp(app)
	} else {
		await handleDevApp(app)
	}

	app.listen(3000, () => {
		console.log('http://localhost:3000')
	})
}
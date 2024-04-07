import { AsyncLocalStorage } from 'node:async_hooks'
import koa from 'koa'
import compress from 'koa-compress'
import fs from 'node:fs'
import koaConnect from 'koa-connect'
import dayjs from 'dayjs'
import { curAppResolve, workspaceResolve } from '../utils/utils'
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
	let template = null

	const getServerStyle = (await import('../plugin/plugin')).getServerStyle

	app.use(koaConnect(vite.middlewares))

	app.use(async (ctx, next) => {
		try {
			const { headers, query, originalUrl } = ctx
			const accept = ctx.request.headers.accept || ''

			if (!accept.includes('text/html')) {
				await next()
				return
			}
			const renderContext = {
				headers,
				query,
				cookies: ctx.headers.cookie,
				path: ctx.originalUrl.match(/[^?]+/)[0]
			}

			template = fs.readFileSync(curAppResolve('index.html'), 'utf8')
			template = await vite.transformIndexHtml(originalUrl, template)

			const entryModule = await vite.ssrLoadModule(
				curAppResolve('./renderer/entry-server.tsx')
			)
			const { render, getServerData } = entryModule

			const curTime = dayjs()
			console.log('curTime', curTime.format())
			const serverData = await getServerData(renderContext)
			const jieTime = dayjs()
			console.log('预先请求结束', jieTime.format(), jieTime.diff(curTime))

			global._asyncLocalStorage.run(
				{ context: renderContext, serverData },
				async () => {
					const appHtml = render(renderContext)
					const html = template
						.replace(
							'<!-- SERVER_DATA -->',
							`<script>window.__SERVER_DATA__=${JSON.stringify(
								JSON.stringify(serverData)
							)}</script>`
						)
						.replace(`<!--css-html-->`, getServerStyle())
						.replace(`<!--app-html-->`, appHtml)

					// if(res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
					const xuanTime = dayjs()
					console.log('渲染结束', xuanTime.format(), xuanTime.diff(jieTime))

					ctx.status = 200
					ctx.type = 'html'
					ctx.body = html
				}
			)
		} catch (error) {
			vite.ssrFixStacktrace(error)
			console.log('error', error)
		}
	})
}
const handleProdApp = async (
	app: koa<koa.DefaultState, koa.DefaultContext>,
	options: CreateServerOptions
) => {
	await initRoutesMap()

	const errorHtml = fs.readFileSync(
		workspaceResolve(`./server/error.html`),
		'utf8'
	)

	if (options.isServeAssets) {
		app.use(
			staticServe(workspaceResolve('./server/public'), {
				defer: false,
				index: 'koaIndex.html'
			})
		)
	}

	app.use(async (ctx, next) => {
		try {
			const { headers, query, originalUrl } = ctx
			const curApp = originalUrl.match(/\/([^/]*)\/?/)?.[1]
			const routeItem = routesMap[curApp]
			const accept = ctx.request.headers.accept || ''

			if (!accept.includes('text/html') || !curApp || !routeItem) {
				await next()
				return
			}

			const { template, render, getServerData } = routesMap[curApp]

			const renderContext = {
				headers,
				query,
				cookies: ctx.headers.cookie,
				path: originalUrl.match(/[^?]+/)[0]
			}

			const serverData = await getServerData(renderContext)

			await global._asyncLocalStorage.run(
				{ context: renderContext, serverData },
				async () => {
					const appHtml = render(renderContext)
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
				}
			)
		} catch (error) {
			console.log(error)
			ctx.status = 500
			ctx.body = errorHtml
		}
	})
}

export type CreateServerOptions = {
	isServeAssets: boolean // 是否提供静态资源服务 如果有自己的静态服务可以关闭
}

export const createServer = async (
	options: CreateServerOptions = { isServeAssets: true }
) => {
	const asyncLocalStorage = new AsyncLocalStorage()
	global._asyncLocalStorage = asyncLocalStorage
	const isProduction = process.env.NODE_ENV === 'production'
	const app = new koa()

	app.use(compress())

	if (isProduction) {
		await handleProdApp(app, options)
	} else {
		await handleDevApp(app)
	}

	app.listen(3000, () => {
		console.log('http://localhost:3000')
	})
}

import { Plugin, searchForWorkspaceRoot, splitVendorChunkPlugin } from 'vite'
import path from 'node:path'
import {
	routerImportPlaceholderName,
	routerPlaceholderName
} from './placeholderName'
import fs from 'node:fs'

// const __dirname = dirname(fileURLToPath(import.meta.url))
// const root = `${__dirname}/..`

// export { root, __dirname, resolve }
const workspaceRoot = searchForWorkspaceRoot(process.cwd())
const resolve = (p: string) => path.resolve(workspaceRoot, p)
const packageName = process.env.npm_package_name || ''

const serverEntryFilePath = resolve('./renderer/entry-server.tsx')
const clientEntryFilePath = resolve(
	'./apps/kemeng-h5/renderer/entry-client.tsx'
)
const pagesSubstring = `apps/${packageName}/pages/`
const pageTsxEnd = '.page.tsx'

const getEntries = () => {
	return {}
}

type RoutesArr = { path: string; componentPath: string }[]

// 获取用于react-router的路由数组对象
const getAllPagesRoutes = (directoryPath: string) => {
	let routesArr: RoutesArr = []

	const getPages = (dir: string) => {
		const files = fs.readdirSync(dir)

		console.log('files', files)

		files.forEach(file => {
			const filePath = path.join(dir, file)
			const stats = fs.statSync(filePath)

			if (stats.isDirectory()) {
				getPages(filePath) // 如果是目录，则递归读取
			} else if (file.endsWith(pageTsxEnd)) {
				const lastPagesIndex = filePath.lastIndexOf(pagesSubstring)
				const urlArr = filePath
					.substring(lastPagesIndex + pagesSubstring.length)
					.split('/')
				const urlArrLastOne = urlArr.pop()?.replace(pageTsxEnd, '') || ''
				urlArrLastOne !== urlArr[urlArr.length - 1] &&
					urlArr.push(urlArrLastOne)

				routesArr.push({
					componentPath: filePath,
					path: `/${urlArr.join('/')}`
				})
				// 输出符合条件的文件路径
			}
		})
	}

	getPages(directoryPath)
	return routesArr
}

const getReactRoutesRender = (routesArr: RoutesArr) => {
	return `/* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { path: "/", Component: lazy(() => import("../App")) }),
		${routesArr
			.map(route => {
				return `/* @__PURE__ */ jsx(Route,{path: "${route.path}",Component: lazy(() => import("${route.componentPath}"))})`
			})
			.join('\n,')}
  ] })`
}

const getReactRoutesImport = () => {
	return `import { Route, Routes } from "react-router-dom";\nimport { lazy } from 'react'`
}

const getAppRender = () => {
	return `/* @__PURE__ */ jsx(App, {})`
}

const getAppImport = () => {
	return `import App from "../App"`
}

function buildConfig(): Plugin[] {
	console.log('proc', workspaceRoot)

	return [
		splitVendorChunkPlugin(),
		{
			name: 'kemeng-ssr:config:ssr',
			config: {
				handler(config, env) {
					return {
						build: {
							ssr: resolve('./apps/kemeng-h5/renderer/entry-server.tsx')
						}
					}
				}
			}
		},
		{
			name: 'kemeng-ssr:build',

			configResolved: {
				order: 'post',
				handler(config) {
					// console.log('config', config)
					config.build.rollupOptions.input = {
						cc: resolve('./apps/kemeng-h5/renderer/entry-client.tsx')
					}
				}
			}
		},
		{
			name: 'kemeng-ssr:entrycodechange',
			transform: {
				handler(code, id, options) {
					if (id === clientEntryFilePath) {
						if (!packageName) {
							this.error('检查package.json name字段是否正确')
						}

						const pageDir = resolve(`./apps/${packageName}/pages`)

						const routesArr = getAllPagesRoutes(pageDir)
						console.log('routesArr', routesArr)

						let codeTemp = ''

						if (routesArr.length === 0) {
							codeTemp = code.replace(
								routerImportPlaceholderName,
								getAppImport()
							)
							codeTemp = codeTemp.replace(routerPlaceholderName, getAppRender())
						} else {
							codeTemp = code.replace(
								routerImportPlaceholderName,
								getReactRoutesImport()
							)
							codeTemp = codeTemp.replace(
								routerPlaceholderName,
								getReactRoutesRender(routesArr)
							)
						}

						console.log('code', codeTemp)

						return codeTemp
					}
				}
			}
		}
	]
}

export { buildConfig }

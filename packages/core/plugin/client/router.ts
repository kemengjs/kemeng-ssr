import { Plugin } from 'vite'
import {
	appName,
	clientEntryFilePath,
	packageName,
	workspaceResolve
} from '../../utils/utils'

import fs from 'node:fs'
import {
	routerImportPlaceholderName,
	routerPlaceholderName
} from '../../utils/placeholderName'
import path from 'node:path'

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

const pagesSubstring = `apps/${appName}/pages/`
const pageTsxEnd = '.page.tsx'

export const getEntryRoutes: () => Plugin[] = () => {
	return [
		{
			name: 'kemeng-ssr:clientEntryRoutes',
			transform: {
				order: 'pre',
				handler(code, id, options) {
					if (id === clientEntryFilePath) {
						if (!packageName) {
							this.error('检查package.json name字段是否正确')
						}

						const pageDir = workspaceResolve(`./apps/${appName}/pages`)

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

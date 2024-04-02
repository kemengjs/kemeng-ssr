import { appName } from './utils'
import path from 'node:path'
import fs from 'node:fs'

export const pageTsxEnd = '.page.tsx'
export const serverDataTsEnd = '.server.ts'

export const serverDataVirtualName = 'virtual:serverData'

export const getServerDataName = 'onBeforeRender'

const pagesSubstring = `apps/${appName}/pages/`

export const getUrlItem = (id: string, pageEnd: string) => {
	const lastPagesIndex = id.lastIndexOf(pagesSubstring)
	const urlArr = id.substring(lastPagesIndex + pagesSubstring.length).split('/')
	const urlArrLastOne = urlArr.pop()?.replace(pageEnd, '') || ''
	urlArrLastOne !== urlArr[urlArr.length - 1] && urlArr.push(urlArrLastOne)

	return {
		componentPath: id,
		path: `/${urlArr.join('/')}`,
		name: urlArr.join('')
	}
}

export type RoutesItem = { path: string; componentPath: string; name: string }
export type RoutesArr = RoutesItem[]
export type RoutesMap = Record<string, RoutesItem>

export const getAllPagesRoutes = (directoryPath: string, pageEnd: string) => {
	let routesArr: RoutesArr = []
	let routesMap: RoutesMap = {}

	const getPages = (dir: string) => {
		const files = fs.readdirSync(dir)

		files.forEach(file => {
			const filePath = path.join(dir, file)
			const stats = fs.statSync(filePath)

			if (stats.isDirectory()) {
				getPages(filePath) // 如果是目录，则递归读取
			} else if (file.endsWith(pageEnd)) {
				const urlObj = getUrlItem(filePath, pageEnd)

				routesArr.push(urlObj)
				routesMap[urlObj.name] = urlObj
				// 输出符合条件的文件路径
			}
		})
	}

	getPages(directoryPath)
	return {
		routesArr,
		routesMap
	}
}

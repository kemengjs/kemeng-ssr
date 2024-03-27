import { Plugin } from 'vite'
import { kemengSrrPluginOption } from '../plugin'
import {
	getServerDataName,
	getUrlItem,
	pageTsxEnd,
	serverDataVirtualName
} from '../../utils/plugin'
import { readFile } from 'node:fs/promises'
import { appFilePath, curAppResolve, mainFilePath } from '../../utils/utils'

const getVirtualServerDataRender = (
	pagesContents: string[],
	pagesIds: string[],
	isHasMainGetServerData: boolean,
	isHasAppGetServerData: boolean
) => {
	const pagesServerDataInfo = pagesContents.map((pagesContent, index) => {
		const isHasServerData = pagesContent.includes(getServerDataName)
		const urlItem = getUrlItem(pagesIds[index])

		return {
			isHasServerData,
			...urlItem
		}
	})

	// 加入app 首页
	pagesServerDataInfo.unshift({
		componentPath: appFilePath,
		name: 'app',
		path: '/',
		isHasServerData: isHasAppGetServerData
	})

	const pagesImportRender = pagesServerDataInfo
		.filter(item => {
			return item.isHasServerData
		})
		.map(item => {
			return `import { ${getServerDataName} as ${item.name} } from '${item.componentPath}'`
		})
		.join('\n')

	const pagesServerDataRender = pagesServerDataInfo
		.map(item => {
			return `'${item.path}' : ${isHasMainGetServerData && item.isHasServerData ? `Promise.all([${getServerDataName}(),${item.name}()])` : isHasMainGetServerData && !item.isHasServerData ? getServerDataName : !isHasMainGetServerData && item.isHasServerData ? item.name : ''}`
		})
		.join(',\n')

	return `${isHasMainGetServerData ? `import { ${getServerDataName} } from '${mainFilePath}'\n` : ''}${pagesImportRender}
  \n\nexport const virtualServerData = {${pagesServerDataRender}}`
}

export const getServerData: (
	option: kemengSrrPluginOption
) => Plugin[] = () => {
	let pagesContentPromises: Promise<string>[] = []
	let pagesIds: string[] = []
	let mainContentPromise: Promise<string> = undefined
	let appContentPromise: Promise<string> = undefined

	const resolvedVirtualModuleId = '\0' + serverDataVirtualName

	return [
		{
			name: 'kemeng-ssr:serverData',
			resolveId: {
				handler(id, _, options) {
					if (options?.ssr && id === serverDataVirtualName) {
						return {
							id: resolvedVirtualModuleId,
							moduleSideEffects: true
						}
					}
					if (options?.ssr && id.endsWith(pageTsxEnd)) {
						console.log('i resolve ', id)
						return null
					}
					return null
				}
			},
			load: {
				order: 'pre',
				handler(id, options) {
					if (options?.ssr && id === resolvedVirtualModuleId) {
						return ''
					}

					if (
						options?.ssr &&
						(id.endsWith(pageTsxEnd) ||
							id === mainFilePath ||
							id === appFilePath)
					) {
						const res = readFile(id, 'utf8')

						if (id === mainFilePath) {
							mainContentPromise = res
							return null
						}

						if (id === appFilePath) {
							appContentPromise = res
							return null
						}

						pagesContentPromises.push(res)
						pagesIds.push(id)
						return null
					}
					return null
				}
			},

			transform: {
				order: 'pre',
				async handler(_, id, options) {
					if (options?.ssr && id === resolvedVirtualModuleId) {
						const [mainContent, appContent, ...pagesContents] =
							await Promise.all([
								mainContentPromise,
								appContentPromise,
								...pagesContentPromises
							])

						console.log(
							'onBeforeRenderFunctions',
							mainContent,
							appContent,
							pagesContents
						)

						const isHasMainGetServerData =
							mainContent.includes(getServerDataName)

						const isHasAppGetServerData = appContent.includes(getServerDataName)

						const code = `${getVirtualServerDataRender(pagesContents, pagesIds, isHasMainGetServerData, isHasAppGetServerData)}`

						console.log('zxc', code)

						return code
					}
				}
			}
		}
	]
}

import { PluginOption } from 'vite'
import { kemengSrrPluginOption } from '../plugin'
import {
	RoutesItem,
	getAllPagesRoutes,
	getServerDataName,
	pageTsxEnd,
	serverDataTsEnd,
	serverDataVirtualName
} from '../../utils/plugin'
import { readFile } from 'node:fs/promises'
import {
	appFilePath,
	appName,
	appServerFilePath,
	mainServerFilePath,
	workspaceResolve
} from '../../utils/utils'

async function readAndReturnEmptyValue(filePath: string) {
	try {
		const data = await readFile(filePath, 'utf8')
		return data
	} catch (error) {
		return '' // 返回空值
	}
}

const getVirtualServerDataRender = (
	pagesServerDataInfo: (RoutesItem & {
		isHasServerData: boolean
		serverPath: string
		specialPath: string
	})[],
	isHasMainGetServerData: boolean
) => {
	const serverPagesImportRender = pagesServerDataInfo
		.filter(item => {
			return item.isHasServerData
		})
		.map(item => {
			return `import { ${getServerDataName} as ${item.name} } from '${item.serverPath}'`
		})
		.join('\n')

	const serverPagesServerDataRender = pagesServerDataInfo
		.map(item => {
			const funcRender =
				isHasMainGetServerData && item.isHasServerData
					? `((context) => Promise.all([${getServerDataName}(context),${item.name}(context)]))`
					: isHasMainGetServerData && !item.isHasServerData
						? getServerDataName
						: !isHasMainGetServerData && item.isHasServerData
							? item.name
							: ''

			return `'${item.path}' :${funcRender},\n'${item.path}/' :${funcRender}${item.specialPath ? `,\n'${item.specialPath}' :${funcRender},\n'${item.specialPath}/' :${funcRender}` : ''}`
		})
		.join(',\n')

	return `${isHasMainGetServerData ? `import { ${getServerDataName} } from '${mainServerFilePath}'\n` : ''}${serverPagesImportRender}
  \n\nexport const virtualServerData = {${serverPagesServerDataRender}}`
}

export const getServerData: (
	option: kemengSrrPluginOption
) => PluginOption[] = option => {
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
					return null
				}
			},
			load: {
				order: 'pre',
				handler(id, options) {
					if (options?.ssr && id === resolvedVirtualModuleId) {
						return ''
					}

					return null
				}
			},

			transform: {
				order: 'pre',
				async handler(_, id, options) {
					if (options?.ssr && id === resolvedVirtualModuleId) {
						const pageDir = workspaceResolve(`./apps/${appName}/pages`)

						const { routesMap: serverRoutesMap } = getAllPagesRoutes(
							pageDir,
							serverDataTsEnd
						)
						const { routesArr: pagesRoutesArr } = getAllPagesRoutes(
							pageDir,
							pageTsxEnd
						)

						const serverFilePromises = pagesRoutesArr.map(item => {
							const serverRoutesItem = serverRoutesMap[item.name]

							return serverRoutesItem
								? readAndReturnEmptyValue(serverRoutesItem.componentPath)
								: Promise.resolve('')
						})

						const mainContentPromise =
							readAndReturnEmptyValue(mainServerFilePath)
						const appContentPromise = readAndReturnEmptyValue(appServerFilePath)

						const [mainContent, appContent, ...serverContents] =
							await Promise.all([
								mainContentPromise,
								appContentPromise,
								...serverFilePromises
							])

						const isHasMainGetServerData =
							mainContent.includes(getServerDataName)

						const isHasAppGetServerData = appContent.includes(getServerDataName)

						const pagesServerDataInfo = pagesRoutesArr.map(
							(pagesRoute, index) => {
								const isHasServerData =
									serverContents[index].includes(getServerDataName)

								return {
									isHasServerData,
									...pagesRoute,
									path: `${option.routePrefix ? `/${option.routePrefix}` : ''}/${appName}${pagesRoute.path}`.toLowerCase(),
									specialPath:
										option.specialRoutesToApps &&
										option.specialRoutesToApps[appName]
											? `/${appName}${pagesRoute.path}`.toLowerCase()
											: '',
									serverPath: serverRoutesMap[pagesRoute.name]?.componentPath
								}
							}
						)

						// 加入app 首页
						pagesServerDataInfo.unshift({
							componentPath: appFilePath,
							name: 'app',
							path: `${option.routePrefix ? `/${option.routePrefix}` : ''}/${appName}`.toLowerCase(),
							specialPath:
								option.specialRoutesToApps &&
								option.specialRoutesToApps[appName]
									? `/${appName}`.toLowerCase()
									: '',
							isHasServerData: isHasAppGetServerData,
							serverPath: appServerFilePath
						})

						const code = `${getVirtualServerDataRender(pagesServerDataInfo, isHasMainGetServerData)}`

						return code
					}
				}
			}
		}
	]
}

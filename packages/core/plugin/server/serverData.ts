import { Plugin } from 'vite'
import { kemengSrrPluginOption } from '../plugin'
import {
	getServerDataName,
	pageTsxEnd,
	serverDataVirtualName
} from '../../utils/plugin'
import { readFile } from 'node:fs/promises'
import { appFilePath, mainFilePath } from '../../utils/utils'

const getVirtualServerDataRender = (
	pagesContents: string[],
	pagesIds: string[],
	isHasMainGetServerData: boolean
) => {
	const hasGetServerDataPages: string[] = []

	pagesContents.forEach((item, index) => {
		if (item.includes(getServerDataName)) {
			hasGetServerDataPages.push(pagesIds[index])
		}
	})

	const pagesImportRender = hasGetServerDataPages
		.map(item => {
			return `import { ${getServerDataName} } from '${item}'`
		})
		.join('\n')

	const pagesServerDataRender = hasGetServerDataPages
		.map(item => {
			return `import { ${getServerDataName} } from '${item}'`
		})
		.join('\n,')

	return `${isHasMainGetServerData ? `import { ${getServerDataName} } from '${mainFilePath}'\n` : ''}${pagesImportRender}
  \n\nexport const virtualServerData = {
          
  }`
}

const getAppDataRender = () => {
	return `<App />`
}

const getAppDataImport = () => {
	return `import App from '../App'`
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

						return `${getVirtualServerDataRender(pagesContents, pagesIds, isHasMainGetServerData)}
            
            
            `
					}
				}
			}
		}
	]
}

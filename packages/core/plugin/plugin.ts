import { Plugin } from 'vite'
import { getClientConfig } from './client/config'
import { getEntryRoutes } from './client/router'
import { getClientChunk } from './client/chunk'
import { serverStart } from './server/build'
import { getClientAssets } from './client/assets'
import { getFileChange } from './server/fileChange'
import { getServerData } from './server/serverData'
import { getServerStyle, getServerCss } from './server/css'
import { removeServerCss } from './client/removeServerCss'

export type kemengSrrPluginOption = {
	isServeAssets: boolean
	routePrefix?: string
}

export const kemengSrrPlugin: (
	option?: kemengSrrPluginOption
) => Plugin[] = (option: { isServeAssets: true }) => {
	return [
		...getClientConfig(),
		...getEntryRoutes(option),
		...getClientChunk(option),
		...getClientAssets(option),
		...removeServerCss(option),
		serverStart(),
		...getFileChange(),
		...getServerData(option),
		...getServerCss(option)
	]
}

export { getServerStyle }

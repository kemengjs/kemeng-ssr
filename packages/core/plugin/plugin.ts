import { Plugin, PluginOption } from 'vite'
import { getClientConfig } from './client/config'
import { getEntryRoutes } from './client/router'
import { getClientChunk } from './client/chunk'
import { serverStart } from './server/build'
import { getClientAssets } from './client/assets'
import { getFileChange } from './server/fileChange'
import { getServerData } from './server/serverData'
import { getServerStyle, getServerCss } from './server/css'
import { removeServerCss } from './client/removeServerCss'
import { getServerExternal } from './server/external'

export type kemengSrrPluginOption = {
	isServeAssets: boolean
	routePrefix?: string
}

export const kemengSrrPlugin: (
	option?: kemengSrrPluginOption
) => PluginOption[] = (option: { isServeAssets: true }) => {
	return [
		...getClientConfig(),
		...getEntryRoutes(option),
		...getClientChunk(option),
		...getClientAssets(option),
		...removeServerCss(option),
		serverStart(),
		...getServerExternal(),
		...getFileChange(),
		...getServerData(option),
		...getServerCss(option)
	]
}

export { getServerStyle }

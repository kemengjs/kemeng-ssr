import { PluginOption, splitVendorChunkPlugin } from 'vite'
import { getClientConfig } from './client/config'
import { getEntryRoutes } from './client/router'
import { serverStart } from './server/build'
import { getClientAssets } from './client/assets'
import { getFileChange } from './server/fileChange'
import { getServerData } from './server/serverData'
import { getServerStyle, getServerCss } from './server/css'
import { removeServerCss } from './client/removeServerCss'
import { getServerExternal } from './server/external'
import { getEnv } from './client/env'

export type kemengSrrPluginOption = {
	isServeAssets: boolean
	routePrefix?: string
}

export const kemengSrrPlugin: (
	option?: kemengSrrPluginOption
) => PluginOption[] = (option: { isServeAssets: true }) => {
	return [
		...getClientConfig(),
		...getEnv(),
		...getEntryRoutes(option),
		splitVendorChunkPlugin(),
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

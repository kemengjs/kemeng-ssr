import { Plugin } from 'vite'
import { getClientConfig } from './client/config'
import { getEntryRoutes } from './client/router'
import { getClientChunk } from './client/chunk'
import { serverStart } from './server/build'
import { getClientAssets } from './client/assets'
import { getFileChange } from './server/fileChange'
import { getServerData } from './server/serverData'

export type kemengSrrPluginOption = {
	isServeAssets: boolean
}

export const kemengSrrPlugin: (
	option?: kemengSrrPluginOption
) => Plugin[] = (option: { isServeAssets: true }) => {
	return [
		...getClientConfig(),
		...getEntryRoutes(),
		...getClientChunk(option),
		...getClientAssets(option),
		serverStart(),
		...getFileChange(),
		...getServerData(option)
	]
}

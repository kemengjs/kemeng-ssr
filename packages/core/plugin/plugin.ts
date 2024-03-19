import { Plugin } from 'vite'
import { getClientConfig } from './client/config'
import { getEntryRoutes } from './client/router'
import { getClientChunk } from './client/chunk'
import { serverStart } from './server/build'

export type kemengSrrPluginOption = {}

export const kemengSrrPlugin: (
	option?: kemengSrrPluginOption
) => Plugin[] = () => {
	return [
		...getClientConfig(),
		...getEntryRoutes(),
		...getClientChunk(),
		serverStart()
	]
}

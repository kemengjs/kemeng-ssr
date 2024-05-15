import { PluginOption, splitVendorChunkPlugin } from 'vite'
import { getClientConfig } from './client/config'
import { getEntryRoutes } from './client/router'
import { getServerBuild } from './server/build'
import { getClientAssets } from './client/assets'
import { getFileChange } from './server/fileChange'
import { getServerData } from './server/serverData'
import { getServerStyle, getServerCss } from './server/css'
import { removeServerCss } from './client/removeServerCss'
import { getServerExternal } from './server/external'
import { getEnv } from './client/env'
import { spawn } from 'node:child_process'
import colors from 'picocolors'

export type kemengSrrPluginOption = {
	isServeAssets: boolean
	routePrefix?: string
}

export const kemengSrrPlugin: (
	option?: kemengSrrPluginOption
) => PluginOption[] = (option: { isServeAssets: true }) => {
	let serverStartPlugin = []

	if (process.env.BUILD_MODE === 'both') {
		const ls = spawn('pnpm', [
			'exec',
			'cross-env',
			'BUILD_MODE=server',
			'vite',
			'--config',
			'./vite.config.mts',
			'build'
		])

		ls.stdout.on('data', data => {
			console.log(`serverBuild: ${colors.cyan(data)}`)
		})

		ls.stderr.on('data', data => {
			console.log(`serverBuildErr: ${colors.red(data)}`)
		})

		ls.on('close', code => {
			console.log(colors.green(`serverBuild exited with code ${code}`))
		})
	}

	if (process.env.BUILD_MODE === 'server') {
		serverStartPlugin = [getServerBuild()]
	}

	return [
		...getClientConfig(),
		...getEnv(),
		...getEntryRoutes(option),
		splitVendorChunkPlugin(),
		...getClientAssets(option),
		...removeServerCss(option),
		...serverStartPlugin,
		...getServerExternal(),
		...getFileChange(),
		...getServerData(option),
		...getServerCss(option)
	]
}

export { getServerStyle }

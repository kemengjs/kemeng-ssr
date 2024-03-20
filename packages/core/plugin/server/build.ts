import { Plugin, build } from 'vite'
import {
	clientEntryName,
	serverEntryFilePath,
	workspaceResolve
} from '../../utils/utils'

export const getServerBuild: () => Plugin[] = () => {
	return [
		{
			name: 'kemeng-ssr:config:ssr',
			config: {
				handler() {
					return {
						build: {
							ssr: serverEntryFilePath
						}
					}
				}
			},
			configResolved: {
				handler(config) {
					config.build.outDir = 'dist/server'
					config.build.assetsDir = './'
				}
			}
		}
	]
}

// 触发server入口构建
export const serverStart: () => Plugin = () => {
	return {
		name: 'kemeng-ssr:serverStart',
		buildStart: {
			handler(options) {
				console.log('options.input', options.input)

				if (options.input[0]?.indexOf('index.html') > 0) {
					build({
						configFile: workspaceResolve('./vite.config.ts'),
						plugins: [getServerBuild()]
					})
				}
			}
		}
	}
}

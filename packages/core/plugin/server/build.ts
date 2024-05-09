import { Plugin, build } from 'vite'
import { curAppResolve, serverEntryFilePath } from '../../utils/utils'

// 切换为ssr入口模式
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
				// 规避dev服务触发
				if (!options.input) {
					return
				}

				if (options.input[0]?.indexOf('index.html') > 0) {
					build({
						configFile: curAppResolve('./vite.config.mts'),
						plugins: [getServerBuild()]
					})
				}
			}
		}
	}
}

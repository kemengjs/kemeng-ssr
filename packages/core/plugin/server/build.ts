import { Plugin } from 'vite'
import { serverEntryFilePath } from '../../utils/utils'

export const getServerBuild: () => Plugin[] = () => {
	return [
		{
			name: 'kemeng-ssr:config:ssr',
			config: {
				handler(config, env) {
					return {
						build: {
							ssr: serverEntryFilePath
						}
					}
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
			}
		}
	}
}

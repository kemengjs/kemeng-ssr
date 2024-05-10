import { PluginOption } from 'vite'

export const getClientConfig: () => PluginOption[] = () => {
	return [
		{
			name: 'kemeng-ssr:clientBuild',
			config: {
				handler() {
					return {
						build: {
							outDir: 'dist/client'
						}
					}
				}
			}

			// configResolved: {
			// 	order: 'post',
			// 	handler(config) {
			// 		config.build.rollupOptions.input = {
			// 			'entry-client': clientEntryFilePath
			// 		}
			// 	}
			// }
		}
	]
}

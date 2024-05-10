import { PluginOption } from 'vite'
import { kemengSrrPluginOption } from '../plugin'

export const getClientChunk: (
	option: kemengSrrPluginOption
) => PluginOption[] = () => {
	return [
		{
			name: 'kemeng-ssr:clientChunk',
			apply: 'build',
			configResolved: {
				handler(config) {
					const isSsr = !!config.build.ssr
					if (!isSsr) {
						if (!Array.isArray(config.build.rollupOptions.output)) {
							if (!config.build.rollupOptions.output) {
								config.build.rollupOptions.output = {}
							}
							config.build.rollupOptions.output.manualChunks =
								function manualChunks(id) {
									if (id.includes('node_modules')) {
										return 'vendor'
									}
								}
						}
					}
				}
			}
		}
	]
}

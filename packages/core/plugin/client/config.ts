import { Plugin } from 'vite'
import { clientEntryFilePath } from '../../utils/utils'

export const getClientConfig: () => Plugin[] = () => {
	return [
		{
			name: 'kemeng-ssr:clientBuild',
			configResolved: {
				order: 'post',
				handler(config) {
					config.build.rollupOptions.input = {
						cc: clientEntryFilePath
					}
				}
			}
		}
	]
}

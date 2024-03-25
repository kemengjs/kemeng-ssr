import { Plugin } from 'vite'
import { kemengSrrPluginOption } from '../plugin'
import { copyDirectory } from '../../utils/file'
import { appName, curAppResolve, workspaceResolve } from '../../utils/utils'

export const getClientAssets: (
	option: kemengSrrPluginOption
) => Plugin[] = option => {
	return [
		{
			name: 'kemeng-ssr:clientServeAssets',
			apply: 'build',
			closeBundle: {
				handler() {
					if (option.isServeAssets) {
						copyDirectory(
							curAppResolve('./dist/client'),
							workspaceResolve(`./server/public/${appName}`)
						)
					}
				}
			}
		}
	]
}

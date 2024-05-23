import { PluginOption } from 'vite'
import { kemengSrrPluginOption } from '../plugin'
import { appName, curAppResolve, workspaceResolve } from '../../utils/utils'
import { copySync, removeSync } from 'fs-extra/esm'
import fs from 'node:fs'
import { removeSlash } from '../../utils/location'

export const getClientAssets: (
	option: kemengSrrPluginOption
) => PluginOption[] = option => {
	let isSsr = false

	return [
		{
			name: 'kemeng-ssr:clientServeAssets',
			apply: 'build',
			configResolved: {
				order: 'post',
				handler(config) {
					isSsr = !!config.build.ssr
				}
			},

			writeBundle: {
				handler() {
					if (option.isServeAssets && !isSsr) {
						const routePrefix = removeSlash(option.routePrefix || '')

						const target = workspaceResolve(
							`./server/public/${routePrefix ? `${routePrefix}/` : ''}${appName}`
						)
						if (fs.existsSync(target)) {
							removeSync(target)
						}

						copySync(curAppResolve('./dist/client'), target)
					}
				}
			}
		}
	]
}

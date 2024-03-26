import { Plugin } from 'vite'
import { kemengSrrPluginOption } from '../plugin'
import { appName, curAppResolve, workspaceResolve } from '../../utils/utils'
import { copySync, removeSync } from 'fs-extra/esm'
import fs from 'node:fs'

export const getClientAssets: (
	option: kemengSrrPluginOption
) => Plugin[] = option => {
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

			closeBundle: {
				handler() {
					if (option.isServeAssets && !isSsr) {
						const target = workspaceResolve(`./server/public/${appName}`)
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

import { Plugin, searchForWorkspaceRoot, splitVendorChunkPlugin } from 'vite'
import path from 'node:path'

// const __dirname = dirname(fileURLToPath(import.meta.url))
// const root = `${__dirname}/..`

// export { root, __dirname, resolve }
const workspaceRoot = searchForWorkspaceRoot(process.cwd())
const resolve = (p: string) => path.resolve(workspaceRoot, p)

const serverEntryFilePath = resolve('./renderer/entry-server.tsx')
const clientEntryFilePath = resolve(
	'./apps/kemeng-h5/renderer/entry-client.tsx'
)

function buildConfig(): Plugin[] {
	console.log('proc', workspaceRoot)

	return [
		splitVendorChunkPlugin(),
		{
			name: 'kemeng-ssr:build',

			configResolved: {
				order: 'post',
				handler(config) {
					// console.log('config', config)
					config.build.rollupOptions.input = {
						cc: resolve('./apps/kemeng-h5/renderer/entry-client.tsx')
					}
				}
			}
		},
		{
			name: 'kemeng-ssr:entrycodechange',
			transform: {
				handler(code, id, options) {
					if (id === clientEntryFilePath) {
						console.log('id', id, code)
					}
				}
			}
		}
	]
}

const getEntries = () => {
	return {}
}

export { buildConfig }

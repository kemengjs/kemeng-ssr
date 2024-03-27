import { Plugin, ViteDevServer } from 'vite'
import { pageTsxEnd, serverDataTsEnd } from '../../utils/plugin'

export const getFileChange: () => Plugin[] = () => {
	let _server: ViteDevServer = undefined

	return [
		{
			name: 'kemeng-ssr:fileChange',
			apply: 'serve',
			configureServer(server) {
				_server = server
			},

			watchChange: {
				handler(id, change) {
					if (
						id.endsWith(pageTsxEnd) &&
						(change.event === 'create' || change.event === 'delete')
					) {
						_server.restart()
					}

					if (
						id.endsWith(serverDataTsEnd) &&
						(change.event === 'update' || change.event === 'delete')
					) {
						_server.restart()
					}
				}
			}
		}
	]
}

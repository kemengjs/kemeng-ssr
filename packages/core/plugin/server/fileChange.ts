import { Plugin, ViteDevServer } from 'vite'
import {
	getServerDataName,
	pageTsxEnd,
	serverDataTsEnd
} from '../../utils/plugin'

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

					if (id.endsWith(serverDataTsEnd) && change.event === 'delete') {
						_server.restart()
					}
				}
			},
			handleHotUpdate: {
				async handler({ file, read, modules, server }) {
					if (file.endsWith(serverDataTsEnd)) {
						const content = await read()

						if (modules.length > 0 && !content.includes(getServerDataName)) {
							server.restart()
							return []
						}

						if (modules.length === 0 && content.includes(getServerDataName)) {
							server.restart()
							return []
						}
					}
				}
			}
		}
	]
}

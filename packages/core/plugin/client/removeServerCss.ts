import { PluginOption } from 'vite'
import { kemengSrrPluginOption } from '../plugin'
import { clientEntryFilePath } from '../../utils/utils'
import { serverCssRemovePlaceholderName } from '../../utils/placeholderName'
import { serverCssId } from '../../utils/store'

export const removeServerCss: (
	option: kemengSrrPluginOption
) => PluginOption[] = () => {
	const getGetRemoveServerRender = () => {
		return `document.querySelector("#${serverCssId}")?.remove()`
	}

	return [
		{
			name: 'kemeng-ssr:clientRemoveServerCss',
			apply: 'serve',
			transform: {
				order: 'pre',
				handler(code, id) {
					if (id === clientEntryFilePath) {
						const codeTemp = code.replace(
							serverCssRemovePlaceholderName,
							getGetRemoveServerRender()
						)

						return codeTemp
					}
				}
			}
		}
	]
}

import { PluginOption } from 'vite'
import { kemengSrrPluginOption } from '../plugin'
import { safeJsonParse } from '../../utils/json'
import { serverCssId } from '../../utils/store'

let cssServerMap: Record<string, string> = {}

export const getServerStyle = () => {
	const cssHtml = Object.keys(cssServerMap).reduce((cur, prev) => {
		cur += cssServerMap[prev]
		return cur
	}, '')

	return `<style type="text/css" id="${serverCssId}" >${cssHtml}</style>`
}

export const getServerCss: (
	option: kemengSrrPluginOption
) => PluginOption[] = () => {
	return [
		{
			name: 'kemeng-ssr:serverCss',
			apply: 'serve',
			transform: {
				order: 'post',
				handler(code, id, options) {
					if (options?.ssr) {
						if (id.endsWith('.css')) {
							cssServerMap[id] = safeJsonParse(code.slice(14))
						}
					}
				}
			},
			watchChange(id, change) {
				if (cssServerMap[id] && change.event === 'delete') {
					delete cssServerMap[id]
				}
			}
		}
	]
}

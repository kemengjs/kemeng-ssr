import { Plugin, splitVendorChunkPlugin } from 'vite'
import { kemengSrrPluginOption } from '../plugin'

export const getClientChunk: (
	option: kemengSrrPluginOption
) => Plugin[] = () => {
	return [splitVendorChunkPlugin()]
}

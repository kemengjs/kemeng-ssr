import { Plugin, splitVendorChunkPlugin } from 'vite'

export const getClientChunk: () => Plugin[] = () => {
	return [splitVendorChunkPlugin()]
}

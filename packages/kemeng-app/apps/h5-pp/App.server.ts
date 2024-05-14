import { isServer } from '@kemengjs/ssr-utils'
import { resolve } from 'path'

// import { a as b } from './renderer/you.js'

export const onBeforeRender = () => {
	if (isServer) {
		const a = resolve(process.cwd())
		console.log('aaaaa', a)
	}
	return {
		fuck: 'app'
	}
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import url from 'node:url'
import { buildConfig } from './zan/plugin'

const baseSource = path.resolve(
	path.dirname(url.fileURLToPath(import.meta.url))
)
const resolve = (p: string) => path.resolve(baseSource, p)
const packageName = process.env.npm_package_name ?? ''

// https://vitejs.dev/config/
export default defineConfig(() => {
	return {
		base: '',
		resolve: {
			alias: {
				'@': baseSource
			}
		},
		build: {
			sourcemap: false,
			assetsInlineLimit: 5 * 1024,
			target: 'es2015'
		},
		plugins: [react(), buildConfig()]
	}
})

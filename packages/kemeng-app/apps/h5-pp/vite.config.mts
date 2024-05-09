import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import url from 'node:url'
import { appName, kemengSrrPlugin } from '@kemengjs/kemeng-ssr'

const baseSource = path.resolve(
	path.dirname(url.fileURLToPath(import.meta.url))
)

// https://vitejs.dev/config/
export default defineConfig(() => {
	return {
		base: `/h5-pp/`,
		resolve: {
			alias: {
				'@': baseSource //基础@请误移除
			}
		},
		build: {
			sourcemap: false,
			assetsInlineLimit: 5 * 1024,
			target: 'es2015'
		},
		plugins: [
			react(),
			kemengSrrPlugin({
				isServeAssets: true
			})
		]
	}
})

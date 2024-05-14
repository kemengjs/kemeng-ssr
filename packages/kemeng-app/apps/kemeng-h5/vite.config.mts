import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import url from 'node:url'
import { appName, kemengSrrPlugin } from '@kemengjs/kemeng-ssr'

const baseSource = path.resolve(
	path.dirname(url.fileURLToPath(import.meta.url))
)
const resolve = (p: string) => path.resolve(baseSource, p)

const workspaceRoot = searchForWorkspaceRoot(process.cwd())
const workspaceResolve = (p: string) => path.resolve(workspaceRoot, p)

// https://vitejs.dev/config/
export default defineConfig(() => {
	return {
		base: `/v/${appName}/`,
		resolve: {
			alias: {
				'@': workspaceRoot //基础@请误移除
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
				isServeAssets: true,
				routePrefix: '/v/'
			})
		]
	}
})

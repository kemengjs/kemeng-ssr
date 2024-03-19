import { defineConfig } from 'vite'
import path from 'node:path'
import url from 'node:url'

const baseSource = path.resolve(
	path.dirname(url.fileURLToPath(import.meta.url))
)
const resolve = (p: string) => path.resolve(baseSource, p)

const packageNameArr = (process.env.npm_package_name || '').split('/')
const packageName = packageNameArr[packageNameArr.length - 1]
console.log('process.env', process.cwd())

// https://vitejs.dev/config/
export default defineConfig(() => {
	return {
		base: '',
		resolve: {
			alias: {
				'@': baseSource,
				'@core': resolve('./packages/core')
			}
		},
		optimizeDeps: {
			exclude: ['node']
		},
		build: {
			sourcemap: false,
			assetsInlineLimit: 5 * 1024,
			target: 'es2015',

			lib: {
				entry: path.join(process.cwd(), 'index.ts'),
				name: packageName,
				fileName: format => `${packageName}.${format}.js`,
				formats: ['es']
			},
			rollupOptions: {
				external: [/node/, 'vite']
			}
		}
	}
})

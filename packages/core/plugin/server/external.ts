import { PluginOption } from 'vite'

// 切换为ssr入口模式
export const getServerExternal: () => PluginOption[] = () => {
	return [
		{
			name: 'kemeng-ssr:serverExternal',
			// apply: 'build',
			config: {
				handler() {
					return {
						ssr: {
							noExternal: true,
							external: [
								'react/jsx-runtime',
								'react-dom/server',
								'react-router-dom/server.mjs',
								'react-router-dom',
								'react'
							]
						}
					}
				}
			}
		}
	]
}

import { PluginOption } from 'vite'

export const getEnv: () => PluginOption[] = () => {
	return [
		{
			name: 'kemeng-ssr:env',
			config: {
				handler(_, option) {
					return {
						define: {
							__SSR_BUILD__: JSON.stringify(option.isSsrBuild)
						}
					}
				}
			}
		}
	]
}

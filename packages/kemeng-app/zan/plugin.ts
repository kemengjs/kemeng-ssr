import { Plugin } from 'vite'

function buildConfig(): Plugin[] {
	return [
		{
			name: 'kemeng-ssr:build',

			configResolved: {
				order: 'post',
				handler(config) {
					console.log('config', config)
				}
			}
		}
	]
}

export { buildConfig }

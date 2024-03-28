import { input } from '@inquirer/prompts'

export const createApp = async () => {
	const projectName = await input({
		message: 'project name: ',
		transformer(value) {
			return value.trim()
		},
		validate(value) {
			if (!value) {
				return 'Please enter the content'
			}

			return true
		}
	})

	console.log('projectName:', projectName)

	const firstAppName = await input({
		message: 'first app name: ',
		validate(value) {
			if (!value) {
				return 'Please enter the content'
			}
			return true
		}
	})

	console.log('firstAppName:', firstAppName)
}

createApp()

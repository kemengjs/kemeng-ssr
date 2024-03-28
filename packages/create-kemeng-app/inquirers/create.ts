import { input } from '@inquirer/prompts'

export const createApp = async () => {
	const projectName = await input({ message: 'project name: ' })

	console.log('projectName:', projectName)

	const firstAppName = await input({ message: 'first app name: ' })

	console.log('firstAppName:', firstAppName)
}

createApp()

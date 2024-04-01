import { input } from '@inquirer/prompts'
import { copySync } from 'fs-extra/esm'
import fs, { mkdirSync } from 'node:fs'
import path from 'node:path'
import mustache from 'mustache'
import { curAppResolve, resolve } from '../utils/utils'
import { logger } from '../utils/log'
import chalk from 'chalk'

const inputBase = {
	validate(value: string) {
		if (!value.trim()) {
			return 'Please enter the content'
		}

		return true
	}
}

function copyAndRender(
	source: string,
	destination: string,
	data: Record<string, string | number>
) {
	// 复制文件夹
	copySync(source, destination)

	// 读取目标文件夹中的所有文件和文件夹
	const items = fs.readdirSync(destination)

	items.forEach(item => {
		const itemPath = path.join(destination, item)

		// 判断是否为文件
		if (fs.statSync(itemPath).isFile()) {
			// 读取文件内容
			let fileContent = fs.readFileSync(itemPath, 'utf8')

			// 使用 Mustache 渲染文件内容
			let renderedContent = mustache.render(fileContent, data)

			// 将渲染后的内容写回文件
			fs.writeFileSync(itemPath, renderedContent, 'utf8')
		} else {
			// 递归处理子文件夹
			copyAndRender(path.join(source, item), itemPath, data)
		}
	})
}

export const createProject = async () => {
	const projectName = (
		await input({
			message: 'project name: ',
			...inputBase
		})
	).trim()

	console.log('projectName:', projectName)

	const firstAppName = (
		await input({
			message: 'first app name: ',
			...inputBase
		})
	).trim()

	console.log('firstAppName:', firstAppName)

	const projectPath = curAppResolve(projectName)

	console.log(fs.existsSync(projectPath))

	if (fs.existsSync(projectPath)) {
		logger.error('文件已存在')

		process.exit(1)
	}

	const data = {
		projectName
	}

	mkdirSync(projectPath)

	copyAndRender(resolve('./templates/project'), projectPath, data)

	const appPath = curAppResolve(`${projectName}/apps/${firstAppName}`)
	mkdirSync(appPath)

	logger.log(chalk.green('项目创建成功！！！'))

	copyAndRender(resolve('./templates/app'), appPath, {
		appName: firstAppName
	})
	logger.log(chalk.green('app创建成功！！！'))
	logger.log(chalk.green('请执行: '))
	logger.log(chalk.green(`cd ./${projectName}`))
	logger.log(chalk.green(`pnpm -F ./apps/${firstAppName} dev`))
}

export const createApp = async () => {
	const appName = (
		await input({
			message: 'app name: ',
			...inputBase
		})
	).trim()

	console.log('app:', appName)

	const appPath = curAppResolve(`./apps/${appName}`)
	if (fs.existsSync(appPath)) {
		logger.error('app已存在 请不要重复创建')

		process.exit(1)
	}

	mkdirSync(appPath)
	copyAndRender(resolve('./templates/app'), appPath, {
		appName: appName
	})
}

createProject()

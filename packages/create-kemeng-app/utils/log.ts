import chalk from 'chalk'

export const logger = console

const log = console.log

console.error = (...arg: unknown[]) => {
	log(chalk.red(...arg))
}

console.warn = (...arg: unknown[]) => {
	log(chalk.yellow(...arg))
}

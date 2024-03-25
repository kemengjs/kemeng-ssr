import fs from 'node:fs'
import path from 'node:path'

// 递归复制目录及其内容的函数
export function copyDirectory(source: string, target: string) {
	if (!fs.existsSync(target)) {
		fs.mkdirSync(target)
	}

	const files = fs.readdirSync(source)

	files.forEach(file => {
		const sourcePath = path.join(source, file)
		const targetPath = path.join(target, file)

		if (fs.statSync(sourcePath).isDirectory()) {
			copyDirectory(sourcePath, targetPath)
		} else {
			fs.copyFileSync(sourcePath, targetPath)
		}
	})
}

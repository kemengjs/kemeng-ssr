import { appName } from './utils'

export const pageTsxEnd = '.page.tsx'

export const serverDataVirtualName = 'virtual:serverData'

export const getServerDataName = 'onBeforeRender'

const pagesSubstring = `apps/${appName}/pages/`

export const getUrlItem = (id: string) => {
	const lastPagesIndex = id.lastIndexOf(pagesSubstring)
	const urlArr = id.substring(lastPagesIndex + pagesSubstring.length).split('/')
	const urlArrLastOne = urlArr.pop()?.replace(pageTsxEnd, '') || ''
	urlArrLastOne !== urlArr[urlArr.length - 1] && urlArr.push(urlArrLastOne)

	return {
		componentPath: id,
		path: `/${urlArr.join('/')}`,
		name: urlArr.join('')
	}
}

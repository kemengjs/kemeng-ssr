import { Plugin } from 'vite'
import {
	appName,
	clientEntryFilePath,
	packageName,
	serverEntryFilePath,
	workspaceResolve
} from '../../utils/utils'

import {
	routerImportPlaceholderName,
	routerPlaceholderName
} from '../../utils/placeholderName'
import { RoutesArr, getAllPagesRoutes, pageTsxEnd } from '../../utils/plugin'

const getReactRoutesRender = (routesArr: RoutesArr, isSsr = false) => {
	if (isSsr) {
		return `<StaticRouter basename='/${appName}' location={_context.path}>
  <Routes>
  <Route path='/' Component={App} />
  ${routesArr
		.map(route => {
			return `<Route path='${route.path}' Component={${route.name}} />`
		})
		.join('\n')}
</Routes>
</StaticRouter>
`
	}

	return `<BrowserRouter basename='/${appName}'>
  <Routes>
  <Route path='/' Component={App} />
  ${routesArr
		.map(route => {
			return `<Route path='${route.path}' Component={${route.name}} />`
		})
		.join('\n')}
</Routes>
</BrowserRouter>
`
}

const getReactRoutesImport = (routesArr: RoutesArr, isSsr = false) => {
	if (isSsr) {
		return `import { StaticRouter } from 'react-router-dom/server'
import { Route, Routes } from 'react-router-dom'
import App from '../App'\n${routesArr
			.map(route => {
				return `import ${route.name} from '${route.componentPath}'`
			})
			.join('\n')}`
	}

	return `import { BrowserRouter, Route, Routes } from 'react-router-dom'
  import App from '../App'\n${routesArr
		.map(route => {
			return `import ${route.name} from '${route.componentPath}'`
		})
		.join('\n')}
  `
}

const getAppRender = () => {
	return `<App />`
}

const getAppImport = () => {
	return `import App from '../App'`
}

export const getEntryRoutes: () => Plugin[] = () => {
	return [
		{
			name: 'kemeng-ssr:clientEntryRoutes',
			transform: {
				order: 'pre',
				handler(code, id, options) {
					if (id === clientEntryFilePath || id === serverEntryFilePath) {
						if (!packageName) {
							this.error('检查package.json name字段是否正确')
						}

						const pageDir = workspaceResolve(`./apps/${appName}/pages`)

						const { routesArr } = getAllPagesRoutes(pageDir, pageTsxEnd)
						console.log('routesArr', routesArr)
						console.log('options.ssr', options?.ssr)

						let codeTemp = ''

						if (routesArr.length === 0) {
							codeTemp = code.replace(
								routerImportPlaceholderName,
								getAppImport()
							)
							codeTemp = codeTemp.replace(routerPlaceholderName, getAppRender())
						} else {
							codeTemp = code.replace(
								routerImportPlaceholderName,
								getReactRoutesImport(routesArr, options?.ssr)
							)
							codeTemp = codeTemp.replace(
								routerPlaceholderName,
								getReactRoutesRender(routesArr, options?.ssr)
							)
						}

						console.log('code', codeTemp)

						return codeTemp
					}
				}
			}
		}
	]
}

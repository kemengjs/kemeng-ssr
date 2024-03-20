import { renderToString } from 'react-dom/server'
import Main from '../main'
import { StaticRouter } from 'react-router-dom/server'
import { Route, Routes } from 'react-router-dom'
import App from '../App'
import AboutAbout from '../pages/About/About/About.page'
import About from '../pages/About/About.page'
import AboutOpp from '../pages/About/Opp.page'
import Fuck from '../pages/Fuck/Fuck.page'

export function render(ssrData: unknown) {
	return renderToString(
		<Main>
			<StaticRouter location={'/'}>
				<Routes>
					<Route path='/' Component={App} />
					<Route path='/About/About' Component={AboutAbout} />
					<Route path='/About' Component={About} />
					<Route path='/About/Opp' Component={AboutOpp} />
					<Route path='/Fuck' Component={Fuck} />
				</Routes>
			</StaticRouter>
		</Main>
	)
}

//<Main ssrData={ssrData} />

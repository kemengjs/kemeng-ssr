import { hydrateRoot } from 'react-dom/client'
import Main from '../main'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from '../App'
import AboutAbout from '../pages/About/About/About.page'
import About from '../pages/About/About.page'
import AboutOpp from '../pages/About/Opp.page'
import Fuck from '../pages/fuck/fuck.page'

hydrateRoot(
	document.getElementById('app')!,
	<Main>
		<BrowserRouter>
			<Routes>
				<Route path='/' Component={App} />
				<Route path='/About/About' Component={AboutAbout} />
				<Route path='/About' Component={About} />
				<Route path='/About/Opp' Component={AboutOpp} />
				<Route path='/Fuck' Component={Fuck} />
			</Routes>
		</BrowserRouter>
	</Main>
)

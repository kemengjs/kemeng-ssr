import { hydrateRoot } from 'react-dom/client'
import { Provider } from 'jotai'
import { Route, Routes } from 'react-router-dom'
import Main from '../main'
import { lazy } from 'react'

const Fuck = lazy(() => import('@/apps/kemeng-h5/pages/Fuck/Fuck.page'))
const About = lazy(() => import('@/apps/kemeng-h5/pages/About/About.page'))

hydrateRoot(
	document.getElementById('app')!,
	<Provider>
		<Main>
			<Routes>
				<Route path='/' Component={Fuck} />
				<Route path='/about' Component={About} />
			</Routes>
		</Main>
	</Provider>
)

// <Main ssrData={safeJsonParse(window.__SSR_DATA__)} />
// import { safeJsonParse } from '../zan/utils'

//import { About } from '@/apps/kemeng-h5/pages/About/About.page'
//<About />

import { renderToString } from 'react-dom/server'
import Main from '../main'

export function render(ssrData: unknown) {
	return renderToString(<Main>{<div>123</div>}</Main>)
}

//<Main ssrData={ssrData} />

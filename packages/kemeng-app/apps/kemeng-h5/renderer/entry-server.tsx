import { renderToString } from 'react-dom/server'
import { Provider } from 'jotai'

export function render(ssrData: unknown) {
	return renderToString(<Provider>{/* Main */}</Provider>)
}

//<Main ssrData={ssrData} />

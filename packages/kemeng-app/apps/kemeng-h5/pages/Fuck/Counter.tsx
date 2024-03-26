import { useState } from 'react'

export { Counter }

function Counter() {
	const [count, setCount] = useState(0)
	return (
		<button type='button' onClick={() => setCount(count => count + 1)}>
			CounterZZZZas1d 726xxx6cc6 {count}
		</button>
	)
}

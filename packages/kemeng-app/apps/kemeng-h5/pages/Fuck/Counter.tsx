import { useState } from 'react'

export { Counter }

function Counter() {
	const [count, setCount] = useState(0)
	return (
		<button type='button' onClick={() => setCount(count => count + 1)}>
			Counterzxcxzc112312ZZZZas1ds 726xxx6cc6 {count}
		</button>
	)
}

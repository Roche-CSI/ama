import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
	// Note: Strict Mode will call render twice in development mode, its not a bug
	// source: https://stackoverflow.com/questions/48846289/why-is-my-react-component-is-rendering-twice
	<React.StrictMode>
		<App/>
	</React.StrictMode>,
)

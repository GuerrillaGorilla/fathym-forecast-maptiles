import { useState } from 'react'
import fathymLogo from '/thinky.svg'
import tailwindLogo from '/tailwind.svg'
import reactLogo from '/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { WeatherMap } from './FathymForecastMaptiles'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <WeatherMap />
      <div className="mx-auto max-w-md">
        <div className="flex h-40 max-w-md items-center justify-center">
          <div className="h-40 w-40">
            <a href="https://fathym.com" target="_blank">
              <img src={fathymLogo} className="logo" alt="Fathym logo" />
            </a>
          </div>
          <div className="h-40 w-40">
            <a href="https://tailwindcss.com" target="_blank">
              <img src={tailwindLogo} className="logo" alt="Tailwind logo" />
            </a>
          </div>
          <div className="h-40 w-40">
            <a href="https://vitejs.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
          </div>
          <div className="h-40 w-40">
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
        </div>
        <h2>Fathym + Tailwind + Vite + React</h2>
      </div>
    </>
  )
}

export default App

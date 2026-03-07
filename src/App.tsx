import Navigation from './components/Navigation'
import WeatherHero from './components/WeatherHero'

function App() {
  return (
   <>
    <Navigation />
    <WeatherHero />
    <iframe src="https://www.panahon.gov.ph/" width={window.innerWidth} height={window.innerHeight}></iframe>
   </> 

  )
}

export default App
    // <>
    //   <div>
    //     <a href="https://vite.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h0>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 0)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </>
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CompanyList from './Components/CompanyList'
import CompanyListAll from './Components/CompanyListAll'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <CompanyList/> */}
      <CompanyListAll/>
    </>
  )
}

export default App

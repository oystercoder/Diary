import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Login from './pages/Login'
import Home from './pages/Home'
import {BrowserRouter,Routes,Route} from 'react-router-dom'

function App() {
 

  return (
    <>
      <BrowserRouter>
    {/* <h2 className='text-3xl text-blue-500 text-center'>Diary</h2> */}
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/home" element={<Home />}/>
     
    
   
    </Routes>

    </BrowserRouter>
    </>
  )
}

export default App

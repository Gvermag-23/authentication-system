import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import  Login from './pages/Login'
import EmailVerify  from './pages/EmailVerify'
import ResetPassword  from './pages/ResetPassword'
const App = () => {
  return (
    <div >
         {/* <h1>Hello React</h1> */}
       <Routes>
          <Route path="/" element={<Home/>} />
          <Route path='/Login' element={<Login/>} />
          <Route path='/EmailVerify' element={<EmailVerify/>} />
          <Route path='/ResetPassword' element={<ResetPassword/>} />
       </Routes>
      </div>
  )
}

export default App;
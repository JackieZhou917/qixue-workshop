import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login'
import Layout from './pages/layout'
import AiChat from './pages/aiChat'
import Home from './pages/home'
import Mine from './pages/mine'
import Recognition from './pages/recognition'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/' element={<Layout />}>
          <Route path='' element={<Navigate to='/home' />}></Route>   {/* 路由重定向 */}
          <Route path='/home' element={<Home />}></Route>
          <Route path='/ai' element={<AiChat />}></Route>
          <Route path='/mine' element={<Mine />}></Route>
          <Route path='/recognition' element={<Recognition />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

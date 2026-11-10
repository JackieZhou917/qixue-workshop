import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login'
import Layout from './pages/layout'
import AiPage from './pages/aiPage'
import AiChat from './pages/aiChat'
import Home from './pages/home'
import Mine from './pages/mine'
import Recognition from './pages/recognition'
import LearnWords from './pages/learnWords'
import LearnPoems from './pages/learnPoems'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/' element={<Layout />}>
          <Route path='' element={<Navigate to='/home' />}></Route>   {/* 路由重定向 */}
          <Route path='/home' element={<Home />}></Route>
          <Route path='/ai' element={<AiPage />}></Route>
          <Route path='/mine' element={<Mine />}></Route>
          <Route path='/recognition' element={<Recognition />}></Route>
          <Route path='/learn-words' element={<LearnWords />}></Route>
          <Route path='/learn-poems' element={<LearnPoems />}></Route>
        </Route>
        <Route path='/ai-chat' element={<AiChat />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

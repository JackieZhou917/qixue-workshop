import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Layout from './pages/layout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/' element={<Layout/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

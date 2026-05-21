//import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import NotFound from './components/notFound/NotFound';
import Bans from './components/bans/bans';
import NewBan from './components/bans/NewBans';

function App() {
//  const [count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path='*' element={<NotFound />} />
        <Route path='bans' element={<Bans />} />
        <Route path='newban' element={<NewBan />} />
      </Routes>
      </BrowserRouter>
      
    </div>
import { useState } from 'react';
import RoutesDoc from './components/routes/RoutesDoc'
import './App.css'

function App() {
    const PageStyle = {
        backgroundColor: "#aaeedf",
    }
  return (
    <section style={PageStyle}>
      <RoutesDoc />
    </section>
  )
}

export default App

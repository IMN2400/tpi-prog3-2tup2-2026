import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from './components/notFound/NotFound';
import Bans from './components/bans/bans';
import NewBan from './components/bans/NewBans';

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {

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
  )
}

export default App

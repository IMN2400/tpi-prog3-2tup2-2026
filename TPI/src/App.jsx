import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from './components/notFound/NotFound';

function App() {

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App

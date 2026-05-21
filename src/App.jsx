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

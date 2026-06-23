import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage'
import TypingPage from './pages/Mecanografia/TypingPage'
import './App.css';
import Navbar from './components/Navbar/Navbar'



const Logo = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{ 
        fontFamily: 'Mate SC',
        fontSize: '24px', 
        fontWeight: 'bold',
        color: '#ffffff'
      }}>
        SCRIPTORIUM
      </span>
    </div>
  );
};

function App() {
  const menuItem = [
    { id: 1, path: '/', label: 'Inicio' },
    { id: 2, path: '/typing', label: 'Typing' },
    { id: 3, path: '/advice', label: 'Advice' },
    { id: 4, path: '/topics', label: 'Topics' }
  ];

  return (
       <Router>  
      <div className="App">
        <Navbar logo={<Logo />} menuItem={menuItem} />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/Typing" element={<TypingPage />} />
        </Routes>
      </div>
      
    </Router>
  );
}

export default App;
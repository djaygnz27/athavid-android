import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AthaVid from './pages/AthaVid';
import CodeCopy from './pages/CodeCopy';
import Home from './pages/Home';
import Index from './pages/Index';
import Install from './pages/Install';
import SPICalculator from './pages/SPICalculator';
import Sachi from './pages/Sachi';
import TaycanFinder from './pages/TaycanFinder';
import TheWatchers from './pages/TheWatchers';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/AthaVid" element={<AthaVid />} />
        <Route path="/CodeCopy" element={<CodeCopy />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Index" element={<Index />} />
        <Route path="/Install" element={<Install />} />
        <Route path="/SPICalculator" element={<SPICalculator />} />
        <Route path="/Sachi" element={<Sachi />} />
        <Route path="/TaycanFinder" element={<TaycanFinder />} />
        <Route path="/TheWatchers" element={<TheWatchers />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

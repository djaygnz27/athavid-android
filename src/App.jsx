import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Install from './pages/Install';
import SPICalculator from './pages/SPICalculator';
import TaycanFinder from './pages/TaycanFinder';
import TheWatchers from './pages/TheWatchers';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Sachi from './pages/Sachi';
import AthaVid from './pages/AthaVid';
import Index from './pages/Index';
import CodeCopy from './pages/CodeCopy';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Install" element={<Install />} />
        <Route path="/SPICalculator" element={<SPICalculator />} />
        <Route path="/TaycanFinder" element={<TaycanFinder />} />
        <Route path="/TheWatchers" element={<TheWatchers />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Sachi" element={<Sachi />} />
        <Route path="/AthaVid" element={<AthaVid />} />
        <Route path="/Index" element={<Index />} />
        <Route path="/CodeCopy" element={<CodeCopy />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

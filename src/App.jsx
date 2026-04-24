import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard';
import JMUXDashboard from './pages/JMUXDashboard';
import Home from './pages/Home';
import Sachi from './pages/Sachi';
import AthaVid from './pages/AthaVid';
import Index from './pages/Index';
import CodeCopy from './pages/CodeCopy';
import Install from './pages/Install';
import TheWatchers from './pages/TheWatchers';
import TaycanFinder from './pages/TaycanFinder';
import SPICalculator from './pages/SPICalculator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/JMUXDashboard" element={<JMUXDashboard />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Sachi" element={<Sachi />} />
        <Route path="/AthaVid" element={<AthaVid />} />
        <Route path="/Index" element={<Index />} />
        <Route path="/CodeCopy" element={<CodeCopy />} />
        <Route path="/Install" element={<Install />} />
        <Route path="/TheWatchers" element={<TheWatchers />} />
        <Route path="/TaycanFinder" element={<TaycanFinder />} />
        <Route path="/SPICalculator" element={<SPICalculator />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

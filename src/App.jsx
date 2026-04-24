import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import JMUXDashboard from './pages/JMUXDashboard';
import Dashboard from './pages/Dashboard';
import Sachi from './pages/Sachi';
import AthaVid from './pages/AthaVid';
import Install from './pages/Install';
import Index from './pages/Index';
import Home from './pages/Home';
import CodeCopy from './pages/CodeCopy';
import TheWatchers from './pages/TheWatchers';
import TaycanFinder from './pages/TaycanFinder';
import SPICalculator from './pages/SPICalculator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/JMUXDashboard" element={<JMUXDashboard />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Sachi" element={<Sachi />} />
        <Route path="/AthaVid" element={<AthaVid />} />
        <Route path="/Install" element={<Install />} />
        <Route path="/Index" element={<Index />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/CodeCopy" element={<CodeCopy />} />
        <Route path="/TheWatchers" element={<TheWatchers />} />
        <Route path="/TaycanFinder" element={<TaycanFinder />} />
        <Route path="/SPICalculator" element={<SPICalculator />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

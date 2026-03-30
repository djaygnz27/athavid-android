import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TaycanFinder from './pages/TaycanFinder';
import TheWatchers from './pages/TheWatchers';
import Home from './pages/Home';
import AthaVid from './pages/AthaVid';
import CodeCopy from './pages/CodeCopy';
import Install from './pages/Install';
import SPICalculator from './pages/SPICalculator';
import Index from './pages/Index';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/TaycanFinder" element={<TaycanFinder />} />
        <Route path="/TheWatchers" element={<TheWatchers />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/AthaVid" element={<AthaVid />} />
        <Route path="/CodeCopy" element={<CodeCopy />} />
        <Route path="/Install" element={<Install />} />
        <Route path="/SPICalculator" element={<SPICalculator />} />
        <Route path="/Index" element={<Index />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

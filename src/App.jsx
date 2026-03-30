import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home';
import AthaVid from './pages/AthaVid';
import Index from './pages/Index';
import Install from './pages/Install';
import CodeCopy from './pages/CodeCopy';
import TaycanFinder from './pages/TaycanFinder';
import SPICalculator from './pages/SPICalculator';
import TheWatchers from './pages/TheWatchers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/AthaVid" element={<AthaVid />} />
        <Route path="/Index" element={<Index />} />
        <Route path="/Install" element={<Install />} />
        <Route path="/CodeCopy" element={<CodeCopy />} />
        <Route path="/TaycanFinder" element={<TaycanFinder />} />
        <Route path="/SPICalculator" element={<SPICalculator />} />
        <Route path="/TheWatchers" element={<TheWatchers />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

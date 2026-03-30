import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AthaVid from './pages/AthaVid';
import CodeCopy from './pages/CodeCopy';
import Home from './pages/Home';
import SPICalculator from './pages/SPICalculator';
import TaycanFinder from './pages/TaycanFinder';
import TheWatchers from './pages/TheWatchers';
import Install from './pages/Install';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/AthaVid" element={<AthaVid />} />
        <Route path="/CodeCopy" element={<CodeCopy />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/SPICalculator" element={<SPICalculator />} />
        <Route path="/TaycanFinder" element={<TaycanFinder />} />
        <Route path="/TheWatchers" element={<TheWatchers />} />
        <Route path="/Install" element={<Install />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

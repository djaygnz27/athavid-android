import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SPICalculator from './pages/SPICalculator';
import TheWatchers from './pages/TheWatchers';
import AthaVid from './pages/AthaVid';
import Home from './pages/Home';
import TaycanFinder from './pages/TaycanFinder';
import CodeCopy from './pages/CodeCopy';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/SPICalculator" element={<SPICalculator />} />
        <Route path="/TheWatchers" element={<TheWatchers />} />
        <Route path="/AthaVid" element={<AthaVid />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/TaycanFinder" element={<TaycanFinder />} />
        <Route path="/CodeCopy" element={<CodeCopy />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

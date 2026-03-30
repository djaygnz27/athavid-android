import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home';
import CodeCopy from './pages/CodeCopy';
import TheWatchers from './pages/TheWatchers';
import AthaVid from './pages/AthaVid';
import TaycanFinder from './pages/TaycanFinder';
import SPICalculator from './pages/SPICalculator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/CodeCopy" element={<CodeCopy />} />
        <Route path="/TheWatchers" element={<TheWatchers />} />
        <Route path="/AthaVid" element={<AthaVid />} />
        <Route path="/TaycanFinder" element={<TaycanFinder />} />
        <Route path="/SPICalculator" element={<SPICalculator />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

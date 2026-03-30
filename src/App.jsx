import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home';
import SPICalculator from './pages/SPICalculator';
import CodeCopy from './pages/CodeCopy';
import AthaVid from './pages/AthaVid';
import TaycanFinder from './pages/TaycanFinder';
import TheWatchers from './pages/TheWatchers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/SPICalculator" element={<SPICalculator />} />
        <Route path="/CodeCopy" element={<CodeCopy />} />
        <Route path="/AthaVid" element={<AthaVid />} />
        <Route path="/TaycanFinder" element={<TaycanFinder />} />
        <Route path="/TheWatchers" element={<TheWatchers />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

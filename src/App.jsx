import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TheWatchers from './pages/TheWatchers';
import AthaVid from './pages/AthaVid';
import TaycanFinder from './pages/TaycanFinder';
import SPICalculator from './pages/SPICalculator';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/TheWatchers" element={<TheWatchers />} />
        <Route path="/AthaVid" element={<AthaVid />} />
        <Route path="/TaycanFinder" element={<TaycanFinder />} />
        <Route path="/SPICalculator" element={<SPICalculator />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TheWatchers from './pages/TheWatchers';
import SPICalculator from './pages/SPICalculator';
import AthaVid from './pages/AthaVid';
import Home from './pages/Home';
import TaycanFinder from './pages/TaycanFinder';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/TheWatchers" element={<TheWatchers />} />
        <Route path="/SPICalculator" element={<SPICalculator />} />
        <Route path="/AthaVid" element={<AthaVid />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/TaycanFinder" element={<TaycanFinder />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

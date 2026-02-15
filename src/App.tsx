import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CanvasProvider } from './canvas/CanvasProvider';
import { SelectionScreen } from './pages/SelectionScreen';
import { ScenePage } from './pages/ScenePage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <CanvasProvider>
        <Routes>
          <Route path="/" element={<SelectionScreen />} />
          <Route path="/scene/:id" element={<ScenePage />} />
        </Routes>
      </CanvasProvider>
    </BrowserRouter>
  );
}

export default App;

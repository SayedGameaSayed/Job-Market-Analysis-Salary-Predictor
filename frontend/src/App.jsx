import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Predictor from './pages/Predictor';
import Explorer from './pages/Explorer';
import Comparison from './pages/Comparison';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predictor" element={<Predictor />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/comparison" element={<Comparison />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

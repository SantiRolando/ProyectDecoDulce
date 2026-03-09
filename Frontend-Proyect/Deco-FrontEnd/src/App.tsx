import { Routes, Route } from 'react-router-dom';
import './App.css'
import Layout from './components/Layout';
import Home from './views/Home';
import About from './views/About';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
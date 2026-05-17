import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signup from './pages/SignupPage';
import ComponentLibraryDemo from './ui/ComponentLibraryDemo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registration" element={<Signup />} />
        <Route path="/demo" element={<ComponentLibraryDemo />} />
      </Routes>
    </Router>
  )
}

export default App
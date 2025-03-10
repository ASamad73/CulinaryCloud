import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import LoginScreen from './pages/login';
import SignupScreen from './pages/signup';
import Recipe from './Recipe.jsx';
import Search from './Search.jsx';

function App() {
  const [login, setLogin] = useState(true);

  return (
    <div className="App">
      {login ? (
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginScreen setLogin={setLogin}/>} />
              <Route path="/signup" element={<SignupScreen />} />
            </Routes>
          </Router>
        </header>
      ) : (
        <div className="page">
          <Search />
          <Recipe />
        </div>
      )}
    </div>
  );
}

export default App;

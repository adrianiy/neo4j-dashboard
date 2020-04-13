import React, { useState } from 'react';
import './App.css';
import Login from './components/login/Login';

function App() {
  const [logged, setLogged] = useState(false);

  const setLoginResponse = response => {
    setLogged(response);
  };


  return (
    <div className="App">
      { !logged ? <Login callback={ setLoginResponse }></Login> : null }
    </div>
  );
}

export default App;

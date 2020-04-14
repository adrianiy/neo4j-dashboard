import React, { useState } from 'react';
import './App.css';
import Login from './components/login/Login';
import Timeline from './components/timeline/Timeline';
import Header from './components/header/Header';

function App() {
    const [driver, setDriver] = useState(false);
    const [user, setUser] = useState('');

    const setLoginResponse = response => {
        setDriver(response.drv);
        setUser(response.user);
    };

    const logout = () => {
        setDriver(null);
    }


    return (
        <div className="App">
            { !driver ? null : <Header user={user} callback={ logout }></Header>}
            { !driver ? <Login callback={ setLoginResponse }></Login> : <Timeline driver={driver}></Timeline> }
        </div>
    );
}

export default App;

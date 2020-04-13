import React, { useState } from 'react';
import './App.css';
import Login from './components/login/Login';
import Timeline from './components/timeline/Timeline';
import Header from './components/header/Header';

function App() {
    const [session, setSession] = useState(false);

    const setLoginResponse = response => {
        setSession(response);
    };


    return (
        <div className="App">
            { !session ? null : <Header session={session}></Header>}
            { !session ? <Login callback={ setLoginResponse }></Login> : <Timeline session={session}></Timeline> }
        </div>
    );
}

export default App;

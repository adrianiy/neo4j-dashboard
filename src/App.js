import React, { useState } from 'react';
import './App.css';
import Login from './components/login/Login';
import Timeline from './components/timeline/Timeline';
import Header from './components/header/Header';
import { doLogout } from './service/neo.service';

function App() {
    const [sessionId, setSessionId] = useState(false);
    const [user, setUser] = useState('');

    const setLoginResponse = response => {
        console.log(response);
        setSessionId(response.sessionId);
        setUser(response.user);
    };

    const logoutHandler = () => {
        logout();
    }

    const logout = async () => {
        const logOutResult = await doLogout(sessionId);
        if (logOutResult) {
            setSessionId(null);
        }
    }


    return (
        <div className="App">
            { !sessionId ? null : <Header user={user} callback={ logoutHandler }></Header>}
            { !sessionId ? <Login callback={ setLoginResponse }></Login> : <Timeline sessionId={sessionId}></Timeline> }
        </div>
    );
}

export default App;

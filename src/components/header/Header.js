import React from 'react';
import styles from './Header.module.css';

function Header(props) {
    return (
        <header className={`${styles.header} row spaced middle`}>
            <div className="row middle spaced">
                <em className={`${styles.icon} material-icons`}>share</em>
                <span>Neo4J Dashboard</span>
            </div>
            <div className="row middle spaced user__container">
                <span>Hi, { props.username }!</span>
                <span className="link">Logout</span>
            </div>
        </header>
    )
};

export default Header;

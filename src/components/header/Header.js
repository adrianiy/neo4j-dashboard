import React from 'react';
import styles from './Header.module.css';
import { RowLayout } from '../../global/layouts';
import { cls } from '../../global/utils';
import { useCookies } from 'react-cookie';

function Header(props) {
    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie, removeCookie] = useCookies(["neo4jDash.sess"]);

    const doLogout = () => {
        removeCookie('neo4jDash.sess');
        props.callback();
    };

    return (
        <RowLayout dist="middle spaced" className={styles.header}>
            <RowLayout dist="middle spaced" className={styles.name}>
                <em className={cls([styles.icon, "material-icons"])}>share</em>
                <span>Neo4J Dashboard</span>
            </RowLayout>
            <RowLayout dist="middle spaced" className={styles.userContainer}>
                <div>Hi, <span>{ props.user }</span>!</div>
                <strong className={ styles.link } onClick={doLogout}>Logout</strong>
            </RowLayout>
        </RowLayout>
    );
};

export default Header;

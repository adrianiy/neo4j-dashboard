import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';

import { RowLayout } from '../../global/layouts';
import { cls } from '../../global/utils';
import actions from '../../global/utils/store/actions';

import styles from './Header.module.css';

function Header(props) {
    // eslint-disable-next-line no-unused-vars
    const [_, __, removeCookie] = useCookies(["neo4jDash.sess"]);
    const [menu, setMenu] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.currentUser);

    const doLogout = () => {
        removeCookie('neo4jDash.sess');
        dispatch(actions.user.logOut());
    };

    const toggleMenu = () => {
        props.toggleMenu(!menu);
        setMenu(!menu);
    }

    return (
        <RowLayout dist="middle spaced" className={cls(styles.header, "animated", "fadeInDown")}>
            <RowLayout dist="middle spaced" className={styles.name}>
                <em className={cls(styles.menu, menu ? styles.menuActive : '', "material-icons")} onClick={toggleMenu}>
                    { menu ? 'menu_open' : 'menu' }
                </em>
            </RowLayout>
            <RowLayout dist="middle spaced" className={styles.userContainer}>
                <div>
                    Hi, <span>{user.user}</span>!
                </div>
                <strong className={styles.link} onClick={doLogout}>
                    Logout
                </strong>
            </RowLayout>
        </RowLayout>
    );
};

export default Header;

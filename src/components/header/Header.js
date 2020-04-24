import React, { useContext } from 'react';
import styles from './Header.module.css';
import { RowLayout } from '../../global/layouts';
import { cls } from '../../global/utils';
import { useCookies } from 'react-cookie';
import { ThemeContext } from '../../global/utils/hooks/theme';


function Header(props) {
    // eslint-disable-next-line no-unused-vars
    const [_, __, removeCookie] = useCookies(["neo4jDash.sess"]);
    const theme = useContext(ThemeContext);

    const doLogout = () => {
        removeCookie('neo4jDash.sess');
        props.callback();
    };

    const handleClick = () => {
        const newTheme = theme.id === 'dark' ? 'light' : 'dark';
        props.themeCallback(newTheme)
    }

    return (
        <RowLayout dist="middle spaced" className={cls(styles.header, "animated", "fadeInDown")}>
            <RowLayout dist="middle spaced" className={styles.name}>
                <em className={cls(styles.icon, "material-icons")}>share</em>
                <span>Neo4J Dashboard</span>
            </RowLayout>
            <RowLayout dist="middle spaced" className={styles.userContainer}>
                <RowLayout dist="middle spaced" className={styles.themeChanger}>
                    <em className={cls("material-icons", styles.lightIcon)}>wb_sunny</em>
                    <RowLayout dist="middle"
                        className={cls('theme-toggler', theme.id === 'dark' ? 'active' : '')}
                        onClick={handleClick}
                    >
                        <div className='theme-toggler__circle'></div>
                    </RowLayout>
                    <em className={cls("material-icons", styles.darkIcon)}>brightness_2</em>
                </RowLayout>
                <div>
                    Hi, <span>{props.user}</span>!
                </div>
                <strong className={styles.link} onClick={doLogout}>
                    Logout
                </strong>
            </RowLayout>
        </RowLayout>
    );
};

export default Header;

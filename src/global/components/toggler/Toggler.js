import React from 'react';
import { RowLayout } from '../../layouts';
import { cls } from '../../utils';

import styles from './Toggler.module.css';

function Toggler(props) {
    return (
        <RowLayout dist="middle"
            className={cls(styles.themeToggler, props.active ? styles.active : '')}
            onClick={props.handleClick}
        >
            <div className={styles.circle}></div>
        </RowLayout>
    )
}

export default Toggler;

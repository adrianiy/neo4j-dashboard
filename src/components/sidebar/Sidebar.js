import React, { useState, useEffect } from 'react';
import { RowLayout, ColumnLayout } from '../../global/layouts';
import Toggler from '../../global/components/toggler/Toggler';

import styles from './Sidebar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../global/utils/store/actions';
import { cls } from '../../global/utils';

function Sidebar(props) {
    const [menu, setMenu] = useState('settings');
    const [theme, setTheme] = useState('auto');
    const [size, setSize] = useState('small');
    const currentTheme = useSelector(state => state.theme);
    const dbSchema = useSelector(state => state.dbSchema);
    const dispatch = useDispatch();

    useEffect(() => {
        setTheme(currentTheme._id);
        setSize(currentTheme.size);
    }, [currentTheme])

    const handleTheme = (_theme) => {
        const newTheme = _theme === theme ? 'auto' : _theme
        setTheme(newTheme);
        if (newTheme === 'auto') {
            dispatch(actions.theme.setAutoTheme());
        } else {
            dispatch(actions.theme.setCustomTheme(newTheme));
        }
    }

    const handleSize = (_size) => {
        const newSize = size === _size
            ? _size === 'small' ? 'wide' : 'small'
            : _size;
        setSize(newSize);
        dispatch(actions.theme.setSize(newSize));
    }

    const renderDbInfo = () => {
        return (
            <ColumnLayout data-testid="sidebar-storage" className={cls(styles.menuContainer, 'hideScroll')}>
                <h3>D.B. Info</h3>
                <span>Node Labels</span>
                <RowLayout dist="left wrap" className={styles.chipsContainer}>
                    {
                        dbSchema.labels.records
                            .map((record, idx) => <div key={idx} className={styles.chip}>{record.get(0)}</div>)
                    }
                </RowLayout>
                <span>Relationship Labels</span>
                <RowLayout dist="left wrap" className={styles.chipsContainer}>
                    {
                        dbSchema.relationshipTypes.records
                            .map((record, idx) => <div key={idx} className={styles.chip}>{record.get(0)}</div>)
                    }
                </RowLayout>
                <span>Poperty Keys</span>
                <RowLayout dist="left wrap" className={styles.chipsContainer}>
                    {
                        dbSchema.propertyKeys.records
                            .map((record, idx) => <div key={idx} className={cls(styles.chip, styles.propChip)}>{record.get(0)}</div>)
                    }
                </RowLayout>
            </ColumnLayout>
        )
    }

    const renderSettings = () => {
        return (
            <ColumnLayout data-testid="sidebar-settings" className={cls(styles.menuContainer, 'hideScroll')}>
                <h3>Theme</h3>
                <RowLayout dist="spaced middle" className={styles.item}>
                    <span>AUTO</span>
                    <Toggler active={theme === 'auto'} handleClick={() => handleTheme('auto')} />
                </RowLayout>
                <RowLayout dist="spaced middle" className={styles.item}>
                    <span>LIGHT</span>
                    <Toggler active={theme === 'light'} handleClick={() => handleTheme('light')} />
                </RowLayout>
                <RowLayout dist="spaced middle" className={styles.item}>
                    <span>DARK</span>
                    <Toggler active={theme === 'dark'} handleClick={() => handleTheme('dark')} />
                </RowLayout>
                <h3>Sizes</h3>
                <RowLayout dist="spaced middle" className={styles.item}>
                    <span>SMALL</span>
                    <Toggler active={size === 'small'} handleClick={() => handleSize('small')} />
                </RowLayout>
                <RowLayout dist="spaced middle" className={styles.item}>
                    <span>WIDE</span>
                    <Toggler active={size === 'wide'} handleClick={() => handleSize('wide')} />
                </RowLayout>
            </ColumnLayout>
        )
    }

    return (
        <RowLayout data-testid="sidebar" dist="left" className={cls(styles.sideBarContainer, props.className)}>
            <ColumnLayout className={styles.options}>
                <em
                    data-testid="settings-toggler"
                    className={cls("material-icons", menu === 'settings' ? styles.optionActive : '')}
                    onClick={() => setMenu('settings')}
                >
                    settings
                </em>
                <em
                    data-testid="storage-toggler"
                    className={cls("material-icons", menu === 'storage' ? styles.optionActive : '')}
                    onClick={() => setMenu('storage')}
                >
                    storage
                </em>
            </ColumnLayout>
            { menu === 'settings' && renderSettings() }
            { menu === 'storage' && renderDbInfo() }
        </RowLayout>
    )
}

export default Sidebar;

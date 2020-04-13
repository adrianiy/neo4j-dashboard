import React, { useState } from 'react';
import styles from './Timeline.module.css';

function Timeline(props) {
    const [query, setQuery] = useState('');

    return (
        <div className={styles.timelineContainer}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type query code to execute..."
            />
            <div className="timeline"></div>
        </div>
    );
};

export default Timeline;

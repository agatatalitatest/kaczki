import React from 'react';

import './definition-box.styles.scss';

const DefinitionBox = ({currentWord, currentDefinition}) => {
    return (
        <div className = "definition-box">
            <div className="current-word">{currentWord}</div>
            <div className="current-definition">{currentDefinition}</div>
        </div>
    )
}

export default DefinitionBox;

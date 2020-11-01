import React from 'react';

import './text-input-box.styles.scss';

const TextInputBox = ({handleSubmit, handleClean, handleRandom, handleChange, handlePagination, text, wordsLimit, wordsOffset}) => {
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="text-buttons">
                <button className="button" onClick={handleClean}>Clean</button>
                <button className="button" onClick={handleRandom}>Put random text</button>
            </div>
            <textarea className='text-input' placeholder="Paste here your text" value = {text} onChange = {handleChange}></textarea>
            <br/>
            <span className="button-description-down">How many translations would you like to generate? (max 100): </span>
            <input className="input-number" value={wordsLimit} name="wordsLimit" label="Words limit" type="number" min="0"  max="100" onChange={handlePagination}></input>
            <br/>
            <span className="button-description-down">Set offset: </span>
            <input className="input-number" value={wordsOffset} name="wordsOffset" label="Words offset" type="number" onChange={handlePagination} min="0" max="1000000"></input>
            <br/>
            <button className="button">Generate</button>
        </form>
    )
}

export default TextInputBox;
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React from 'react';

import OutsideClickHandler from 'react-outside-click-handler';

import './words-list.styles.scss';

const WordsList = ({mostFrequentWords, handleOverWord, handleOutWord, handleClickWord, handleClickOutsideWord }) => {

    const colors = ['pink', 'peach', 'millenial', 'yellow', 'mint', 'beige', 'blue', 'blue2' ];

    return(
        <OutsideClickHandler onOutsideClick={() => {
            handleClickOutsideWord()
          }}>
            <div className='words-list'>
            {mostFrequentWords.map(word => {
                if(!word) {
                    return undefined;
                }
                const index =  parseInt(Math.random() * colors.length, 10)
                const additionalStyle = colors[index];
                return(
                <div className='word-box' key={word[0]} onMouseOver={() => handleOverWord(word)} onMouseOut={handleOutWord} onClick={() => handleClickWord(word)}>
                    <div className='word-icon'><FontAwesomeIcon className={`${additionalStyle}`} icon={['fas', 'circle']} /></div>
                    <div className='word'>{word[0]}</div>
                    <div className='word-number'>&nbsp;&nbsp;{word[1]}</div>
                    <div className='word-meaning'>, {word[2].slice(0,60)}...</div></div>)
                })}
            </div>
        </OutsideClickHandler>
    )
}

export default WordsList;
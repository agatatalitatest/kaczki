import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React from 'react';

import wtf from 'wtf_wikipedia';

import exampleText from '../../data/default-text';
import exampleTextPl from '../../data/default-text-pl';
import { ReactComponent as Logo} from '../../data/loader.svg';
import {saveBook} from "../../firebase/firebase.utils";
import DefinitionBox from "../../components/definition-box/definition-box.component";
import TextInputBox from "../../components/text-input-box/text-input-box.component";
import WordsList from "../../components/words-list/words-list.component";

import './homepage.styles.scss';

const HomePage = () => {
    const [text, setText] = React.useState(exampleText);
    const [mostFrequentWords, setMostFrequentWords] = React.useState([]);
    const [wordsLimit, setWordsLimit] = React.useState(20);
    const [wordsOffset, setWordsOffset] = React.useState(0);
    const [loadingStarted, setLoadingStarted] = React.useState(false)
    const [currentWord, setCurrentWord] = React.useState(undefined)
    const [currentClickedWord, setCurrentClickedWord] = React.useState(undefined)
    const [currentClickedDefinition, setCurrentClickedDefinition] = React.useState(undefined)
    const [currentDefinition, setCurrentDefinition] = React.useState(undefined)
    const [czeski, setCzeski] = React.useState(true);
    const [polski, setPolski] = React.useState(false);


    console.clear();
    console.log(`cze­kam cze­kam wy­trwa­le
    tak lek­ko do­ty­ka­ją mnie dni
    moja tę­sk­no­ta jest tę­sk­no­tą pla­net
    zmar­z­łych tę­sk­nią­cych do słoń­ca
    jest zno­wu wie­czór
    po dachach ślizga się blask księżyca
    wą­skie wie­że ko­ścio­łów na­kłu­wa­ją nie­bo
    i dni tak lek­ko bie­gną nie wia­do­mo gdzie `)
    console.log(`<3`)
    console.log('%c ', 'font-size:1px; padding: 100px 150px; background:url(https://66.media.tumblr.com/36584c3bb4ad641e9060ced5756c85d2/tumblr_pi2opgP0Tw1u8pg83o1_640.png) no-repeat; background-size: contain;');

    const WORDS_LIMIT_MAX = 100;
    const WORDS_OFFSET_MAX = 1000000;

    const handleChange = async event => {
        const { value } = event.target;
        await setText(value);
    } 

    const handleSubmit = async event => {
        event.preventDefault();
        await saveBook('dziki', 'slodziaki', [{text: 'Czy to prawda?'}, {text: 'Nic nigdy nie było dla mnie bardziej prawdziwe.'}]);
        await setLoadingStarted(true);
        await setMostFrequentWords([]);
        await chooseWords(text);
        await setLoadingStarted(false);
    }

    const handleClean = async event => {
        event.preventDefault();
        setText('');
    }

    const handleRandom = async event => {
        event.preventDefault();
        setText(czeski ? exampleText : exampleTextPl);
    }

    const handlePagination = async event => {
        let { name, value } = event.target;
        if (value < 0) return;
        if(name === 'wordsOffset') {
            value = Math.min(value, WORDS_OFFSET_MAX);
            setWordsOffset(value)
        } else {
            value = Math.min(value, WORDS_LIMIT_MAX);
            setWordsLimit(value) 
        }       
    }

    const handleOverWord = (word) => {
        setCurrentWord(word[0]);
        setCurrentDefinition(word[2]);
    }

    const handleOutWord = () => {
        setCurrentWord(undefined);
        setCurrentDefinition(undefined);
    }

    const handleClickWord = (word) => {
        setCurrentClickedWord(word[0]);
        setCurrentClickedDefinition(word[2]);
    }

    const handleClickOutsideWord = () => {
        setCurrentClickedWord(undefined);
        setCurrentClickedDefinition(undefined);
    }

    const handleCzech = () => {
        setPolski(false);
        setCzeski(true);
    }
    const handlePolish = () => {
        setCzeski(false);
        setPolski(true);
    }

    const chooseWords = async textToEdit => {
        textToEdit = textToEdit.toLowerCase();
        textToEdit = textToEdit.replace(/[&/\\#,+=()$!„“~%.'0-9":;*_?<>{}\n]/g, ' ');

        let wordsList = textToEdit.split(" ");

        // filter out not wanted words
        wordsList = wordsList.filter(word=> !['-', '–', ' ', ''].includes(word))
        // count words
        const wordsDictionary = {};

        for(const word of wordsList) {
            if(word in wordsDictionary){
                wordsDictionary[word]++;
            } else {
                wordsDictionary[word] = 1;
            }
        }

        let items = await Promise.all(Object.keys(wordsDictionary).map(async function(key) {

            return [key, wordsDictionary[key]]
        }));

        // Sort the array based on the second element
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
        items = items.slice(wordsOffset, wordsLimit + wordsOffset)

        items = await Promise.all(items.map(async function(item) {

            const language = czeski ? 'cs' : 'pl';
            const fetchedText = await wtf.fetch(`https://${language}.wiktionary.org/wiki/${item[0]}`);
            
            if(!fetchedText)
                return [item[0], item[1], 'brak definicji']

            let meaning, uciety;
            if(czeski){
                meaning = fetchedText.sections('čeština') ? fetchedText.sections('čeština').sections('význam') : fetchedText.sections('význam')
                meaning = meaning || 'no definition';
            } //else {
            //     for (let [key, ] of Object.entries(fetchedText.sections())) {
            //         console.log(fetchedText.sections()[key]);
            //         const re = new RegExp('({{)|(}})', 'g');
            //         fetchedText.sections()[key]._title = (fetchedText.sections()[key].data.title_templates && fetchedText.sections()[key].data.title_templates[0]) ? fetchedText.sections()[key].data.title_templates[0].replace(re, '') : fetchedText.sections()[key]._title 
            //         //meaning[key] = section.data.title_templates ? section.data.title_templates : section.title;
            //       }
            //     meaning = fetchedText && fetchedText.sections('język polski')
            //     const pierwszy = fetchedText.data.wiki.indexOf('{{język polski}}')
            //     uciety = fetchedText.data.wiki.slice(pierwszy)
            // }

            if(!meaning){
                return;
            }

            let meaningText;
            if(czeski){
            meaningText = await wtf(meaning.data.wiki).text();
            }
            if(polski){
            const ma = uciety.match(/\{\{znaczenia\}\}((.|\n)+?)\{\{(odmiana|przykłady)/)

            meaningText = await wtf(ma[0]).text()
            }
            let i = 0;
            while(meaningText && meaningText.indexOf('*') !== -1) {
                if(i >= 6){
                    const stop = meaningText.indexOf('*');
                    meaningText = meaningText.slice(0,stop);
                    break;
                }
                i+=1;
                meaningText = meaningText.replace('*', '\n•');
                meaningText = meaningText.replace(/[0-9]\)/, '')
                meaningText = meaningText.replace(/\([0-9]/, '')
            }
            return [item[0], item[1], meaningText ]// await getWordData(key)]
        }));

        await setMostFrequentWords(items)
        
        // Create a new array with only the first x items
        return wordsDictionary;
    }
    return(
        <div className='home-page'>
            <div className='words-list-box'>
                {(mostFrequentWords.length === 0 && loadingStarted) &&  <Logo className="loader" /> }
                {(mostFrequentWords.length === 0 && !loadingStarted) &&  <div>
                    <div className='blank-info'>Click generate to create a dictionary</div>
                    </div> }
                    <WordsList handleOutWord={handleOutWord} handleOverWord={handleOverWord} handleClickWord={handleClickWord} mostFrequentWords={mostFrequentWords} handleClickOutsideWord={handleClickOutsideWord} />   
            </div>
            <div className='text-input-box'>
                <div className={`title ${czeski && 'big'}`} onClick={handleCzech}>Tento způsob leta</div>
                <div className={`title ${polski && 'big'}`} onClick={handlePolish}>wydaje się być niefortunny.</div>
                <div className="info"><FontAwesomeIcon icon={['fas', 'info-circle']} /></div>
                <div className='explanation'>Paste text below and change it into book specific dictionary</div>

                <TextInputBox handleSubmit={handleSubmit} handleClean={handleClean} handleRandom={handleRandom} handleChange={handleChange} handlePagination={handlePagination} text={text} wordsLimit={wordsLimit} wordsOffset={wordsOffset} />
                
                {currentWord ? <DefinitionBox className="hover-word-definition" currentWord={currentWord} currentDefinition={currentDefinition} /> : currentClickedWord && <DefinitionBox className="clicked-word-definition" currentWord={currentClickedWord} currentDefinition={currentClickedDefinition} /> }
            </div>
        </div>
    )
}

export default HomePage;
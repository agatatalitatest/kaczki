import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyAPLo55ny3FGgXt-7_ZwDpPHUjMImWCFVQ",
    authDomain: "kaczkilubiaslonecznik.firebaseapp.com",
    databaseURL: "https://kaczkilubiaslonecznik.firebaseio.com",
    projectId: "kaczkilubiaslonecznik",
    storageBucket: "kaczkilubiaslonecznik.appspot.com",
    messagingSenderId: "289657064359",
    appId: "1:289657064359:web:c05f9dbffba32a073a8482"
};

firebase.initializeApp(config);

const db = firebase.firestore();

// export const getWordData = async word => {
//     const wordsRef = firestore.collection('words');
//     let wordData = await wordsRef.where('word', "==", word).get();
//     let wordDataMeaning = 'brak definicji';
//     wordData = wordData.forEach(
//         doc => {console.log(doc.data().meaning);
//             wordDataMeaning = doc.data().meaning;}
//     )
//     return wordDataMeaning;
// }

export const saveBook = async (book, bookName, sentencesArray) => {

    console.log("dziiikii")
    db.collection("books").add({
        name: bookName,
        text: book,
        numberOfSentences: sentencesArray.length
    })
    .then(function(docRef) {
        let index = 0
        sentencesArray.forEach(sentence => {
            db.collection('books').doc(docRef.id).collection('sentences').add({
                number: ++index,
                text: sentence.text,
                googleTranslation: '',
                myTranslation: '',
                defaultTranslation: 'google'
            })
        });

        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

    
    return true;
}
  

// export default firebase;
export default {saveBook};


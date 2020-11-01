import firebase from '../firebase.utils';

export const saveBook = async (book, bookName) => {

    console.log("dziiikii")
    firebase.database().ref('books/' + bookName).set({
        name: bookName,
        book: book
    });
    return true;
}
  

export default {saveBook};

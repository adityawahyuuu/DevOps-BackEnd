const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const bookSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    year: {   
        type: Number,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: false,
    },
    publisher: {
        type: String,
        required: false,
    },
    pageCount: {
        type: Number,
        required: true,
    },
    readPage: {
        type: Number,
        required: true,
    },
    finished: {
        type: Boolean,
        required: true,
    },
    insertedAt: {
        type: String,
        required: false,
    },
    updatedAt: {
        type: String,
        required: true,
    },
});

const Book = mongoose.model('Book', bookSchema);

const existingBook = async (filter) => {
    try{
        const idObject = await Book.exists(filter);
        return idObject;

    } catch(e){
        console.log(e);
    }
}

const findAllData = async () => {
    try{
        // const Book = mongoose.model('Book', bookSchema);
        const allBook = await Book.find();
        return allBook;
    } catch(e){
        console.log(e);
    }
}

module.exports = {existingBook, findAllData, Book};
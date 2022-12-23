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

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    }
});

const Book = mongoose.model('Book', bookSchema);
const createCollection = (collection, Schema) => {
    return mongoose.model(collection, Schema);
};

const existingData = async (filter, data) => {
    try{
        const idObject = await data.exists(filter);
        return idObject;
    } catch(e){
        console.log(e);
    }
}

const findAllData = async (data) => {
    try{
        const allBook = await data.find();
        return allBook;
    } catch(e){
        console.log(e);
    }
}

module.exports = {createCollection, existingData, findAllData, Book, bookSchema, userSchema};
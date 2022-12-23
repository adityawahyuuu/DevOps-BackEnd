const mongoose = require('mongoose');

const options = {
    dbName: "noob-data",
};
mongoose.connect('mongodb+srv://aditya:human567@cluster0.hxrc6b2.mongodb.net/?retryWrites=true&w=majority', options);

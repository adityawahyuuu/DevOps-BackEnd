const mongoose = require('mongoose');

const options = {
    dbName: "noob-data",
};
mongoose.connect('mongodb+srv://username:password@cluster0.hxrc6b2.mongodb.net/?retryWrites=true&w=majority', options);

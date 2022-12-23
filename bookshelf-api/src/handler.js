const JWT = require('jsonwebtoken');
const {existingData, findAllData, Book, authData} = require('./db-collections');
const secret = require('./config');

const onlySpaces = (str) => {
    return str.trim().length === 0;
};

// -------------------------------------------------- //
// ------------- Authentication Handler ------------- //
// -------------------------------------------------- //
const mainPageHandler = (req, h) => {
    try{
        return h.view('main-page', {message: ``});
    } catch(e){
        return h.view('main-page', {message: `${e}`});
    }
};


const formSignUpHandler = (req, h) => {
    try{
        return h.view('sign-form', {});
    } catch(e){
        return h.view('empty', {message: `${e}`});
    }
};

const signUpHandler = async (req, h) => {
    try{
        data = req.payload;
        const {username, password} = data;
        const newUser = {username, password};
        
        const user = new authData(newUser);
        
        const filterUser = {
            username
        };
        const idUser = await authData.exists(filterUser, authData);
        if (idUser == null){
            await user.save();
            return h.view('sign-response', {
                message: `${data.username} Berhasil ditambahkan`
            });
        }
        return h.view('sign-response', {
            message: `${data.username} Sudah Ada`
        });
        
    } catch(e){
        return h.view('sign-response', {message: `${e}`});
    }
};

const formSignInHandler = (req, h) => {
    try{
        return h.view('sign-in-form', {});
    } catch(e){
        return h.view('empty', {message: `${e}`});
    }
};

const signInHandler = async (req, h) => {
    try{
        data = req.payload;
        const {username, password} = data;
        const users = await findAllData(authData);
        const user = users.filter(user => ((user.username === username) && (user.password === password)));
        const userAuth = {
            username: user[0].username,
            password: user[0].password
        }
        // console.log(userAuth);
        const token = JWT.sign(userAuth, secret, {algorithm: 'HS256'});
        // console.log(token);
        return h.view('form-token', {
            token: token
        });
    } catch(e){
        return h.view('sign-response', {message: `${e}`});
    }
};


// -------------------------------------------------- //
// ------------- Authorization Handler -------------- //
// -------------------------------------------------- //
const getAllBooksHandler = async (req, h) => {
    try{
        const header = req.auth;
        const token = header.token;
        // console.log(token);
        const bookArray = await findAllData(Book);
        return h.view('all-book', {
            bookArray,
            token
        });
    } catch(e){
        const header = req.auth;
        const token = header.token;
        return h.view('empty', {
            message: `${e}`,
            token
        });
    }
};

const formAddBookHandler = (req, h) => {
    try {
        const header = req.auth;
        const token = header.token;
        return h.view('form-book', {token});

    } catch(e){
        const header = req.auth;
        const token = header.token;
        return h.view('empty', {
            message: `${e}`,
            token
        });
    }
};

const addBookHandler = async (req, h) => {
    try{
        const data = req.payload;
        const {name, year, author, summary, publisher, pageCount, readPage} = data;
        const finished = (pageCount === readPage) ? true:false;
        const insertedAt = new Date().toString();
        const updatedAt = insertedAt;

        const newBook = {
            name, year, author, summary, publisher, pageCount, readPage, finished, insertedAt, updatedAt
        };
        const book = new Book(newBook);

        const filterBook = {
            name: name,
            year: year,
            author: author
        };
        const id = await existingData(filterBook, Book);
        if(id === null){
            const header = req.auth;
            const token = header.token;
            if(onlySpaces(name)){
                return h.view('empty', {
                    message: `Nama Buku tidak Boleh Hanya Whitespace`,
                    token
                });
            } else if(parseInt(readPage) > parseInt(pageCount)){
                return h.view('empty', {
                    message: `Read Page tidak Boleh Lebih dari Page Count`,
                    token
                });
            }
            await book.save();
            return h.view('empty', {
                message: `${name} berhasil ditambahkan`,
                token
            });

        } else{
            const header = req.auth;
            const token = header.token;
            return h.view('empty', {
                message: `Buku ${name} sudah ada`,
                token
            });
        }
    } catch(e){
        const header = req.auth;
        const token = header.token;
        return h.view('empty', {
            message: `${e}`,
            token
        });
    }
};

const getBookByIdHandler = async (req, h) => {
    try{
        const header = req.auth;
        const token = header.token;
        const {id} = req.params;
        const bookArray = await findAllData(Book);
        const books = bookArray.filter(book => book._id == id);
        if(books.length > 0){
            return h.view('by-id-view', {
                token,
                id: books[0].id,
                name: books[0].name,
                year: books[0].year,
                summary: books[0].summary,
                publisher: books[0].publisher,
                pageCount: books[0].pageCount,
                readPage: books[0].readPage,
                finished: books[0].finished,
                insertedAt: books[0].insertedAt,
                updatedAt: books[0].updatedAt
            });
        }
        return h.view('empty', {
            message: `Buku tidak ditemukan`,
            token
        })
    } catch(e){
        const header = req.auth;
        const token = header.token;
        return h.view('empty', {
            message: `${e}`,
            token
        });
    }
};

const formEditBookHandler = async (req, h) => {
    try {
        const header = req.auth;
        const token = header.token;
        const id = req.params.id;
        return h.view('form-edit-book', {
            id,
            token
        });

    } catch(e){
        const header = req.auth;
        const token = header.token;
        return h.view('empty', {
            message: `${e}`,
            token
        });
    }
}

const editBookByIdHandler = async (req, h) => {
    try{
        const {id} = req.params;
        const data = req.payload;
        const {name, year, author, summary, publisher, pageCount, readPage} = data;
        const updatedAt = new Date().toString();
        const finished = (pageCount === readPage) ? true:false;
        const bookArray = await findAllData(Book);
        const index = bookArray.findIndex(book => book._id == id);
        
        const header = req.auth;
        const token = header.token;
        if(index != -1){
            if(onlySpaces(name)){
                return h.view('empty', {message: `Nama Buku tidak Boleh Hanya Whitespace`});
            } else if(parseInt(readPage) > parseInt(pageCount)){
                return h.view('empty', {message: `readPage tidak boleh lebih besar dari pageCount`});
            }
            bookArray[index].name = name;
            bookArray[index].year = year;
            bookArray[index].author = author;
            bookArray[index].summary = summary;
            bookArray[index].publisher = publisher;
            bookArray[index].pageCount = pageCount;
            bookArray[index].readPage = readPage;
            bookArray[index].finished = finished;
            bookArray[index].updatedAt = updatedAt;

            bookArray[index].save();
            return h.view('empty', {
                message: `Buku ${bookArray[index].name} Berhasil Diupdate`,
                token
            });
        } else{
            return h.view('empty', {
                message: `Gagal memperbarui buku. Id tidak ditemukan`,
                token
            });
        }
        
    } catch(e){
        const header = req.auth;
        const token = header.token;
        return h.view('empty', {
            message: `${e}`,
            token
        });
    }
};

const deleteValidationHandler = async (req, h) => {
    try {
        const header = req.auth;
        const token = header.token;
        const id = req.params.id;
        return h.view('validation-delete-book', {
            id,
            token
        });
    } catch(e){
        const header = req.auth;
        const token = header.token;
        return h.view('empty', {
            message: `${e}`,
            token
        });
    }
};

const deleteBookByIdHandler = async (req, h) => {
    try{
        const {id} = req.params;
        const data = req.payload;
        const bookArray = await findAllData(Book);
        const index = bookArray.findIndex(book => (book._id == id) && (id == data.id));

        const header = req.auth;
        const token = header.token;
        if(index != -1){
            Book.deleteOne({_id: bookArray[index].id}, (err, doc) => {
                if(err){
                    console.log(err);
                }
                console.log("Deleted doc: ", doc);
            })
            const deletedAt = new Date().toString();
            bookArray[index].updatedAt = deletedAt
            return h.view('empty', {
                message: `"${bookArray[index].name}" Berhasil dihapus ${deletedAt}`,
                token
            });
        } else{
            return h.view('empty', {
                message: `Buku gagal dihapus. Id yang anda masukan tidak sesuai`,
                token
            });
        }
    } catch(e){
        const header = req.auth;
        const token = header.token;
        return h.view('empty', {
            message: `${e}`,
            token
        });
    }
};

module.exports = {signInHandler, formSignInHandler, mainPageHandler, signUpHandler, formSignUpHandler, formAddBookHandler, addBookHandler, getAllBooksHandler, getBookByIdHandler, formEditBookHandler, editBookByIdHandler, deleteValidationHandler, deleteBookByIdHandler};
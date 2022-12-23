const JWT = require('jsonwebtoken');
const {createCollection, existingData, findAllData, Book, bookSchema, userSchema} = require('./db-collections');
const secret = require('./config');

const onlySpaces = (str) => {
    return str.trim().length === 0;
};

const loginUser = [];

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
        
        const authUser = createCollection('user', userSchema);
        const user = new authUser(newUser);
        
        const filterUser = {
            username
        };
        const idUser = await authUser.exists(filterUser, authUser);
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
        const session = {username, password}
        loginUser.push(session);
        const authUser = createCollection('user', userSchema);
        const users = await findAllData(authUser);
        const user = users.filter(user => ((user.username === username) && (user.password === password)));
        const userAuth = {
            username: user[0].username,
            password: user[0].password
        }
        const token = JWT.sign(userAuth, secret, {algorithm: 'HS256'});
        return h.view('form-token', {
            token
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
        const book = createCollection(loginUser[0].username, bookSchema);
        const bookArray = await findAllData(book);
        return h.view('all-book', {
            bookArray,
            token: req.auth.token,
            session: `${loginUser[0].username}'s Books`
        });
    } catch(e){
        return h.view('empty', {
            message: `${e}`,
            token: req.auth.token,
            session: `${loginUser[0].username}'s Books`
        });
    }
};

const formAddBookHandler = (req, h) => {
    try {
        return h.view('form-book', {
            token: req.auth.token,
            session: `${loginUser[0].username}'s Books`
        });

    } catch(e){
        return h.view('empty', {
            message: `${e}`,
            token: req.auth.token,
            session: `${loginUser[0].username}'s Books`
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
        const book = createCollection(loginUser[0].username, bookSchema);
        const bookNew = new book(newBook);

        const filterBook = {
            name: name,
            year: year,
            author: author
        };
        const id = await existingData(filterBook, book);
        if(id === null){
            if(onlySpaces(name)){
                return h.view('empty', {
                    message: `Nama Buku tidak Boleh Hanya Whitespace`,
                    token: req.auth.token,
                    session: `${loginUser[0].username}'s Books`
                });
            } else if(parseInt(readPage) > parseInt(pageCount)){
                return h.view('empty', {
                    message: `Read Page tidak Boleh Lebih dari Page Count`,
                    token: req.auth.token,
                    session: `${loginUser[0].username}'s Books`
                });
            }
            await bookNew.save();
            return h.view('empty', {
                message: `${name} berhasil ditambahkan`,
                token: req.auth.token,
                session: `${loginUser[0].username}'s Books`
            });

        } else{
            return h.view('empty', {
                message: `Buku ${name} sudah ada`,
                token: req.auth.token,
                session: `${loginUser[0].username}'s Books`
            });
        }
    } catch(e){
        return h.view('empty', {
            message: `${e}`,
            token: req.auth.token,
            session: `${loginUser[0].username}'s Books`
        });
    }
};

const getBookByIdHandler = async (req, h) => {
    try{
        const {id} = req.params;
        const book = createCollection(loginUser[0].username, bookSchema);
        const bookArray = await findAllData(book);
        const books = bookArray.filter(book => book._id == id);
        if(books.length > 0){
            return h.view('by-id-view', {
                id: books[0].id,
                name: books[0].name,
                year: books[0].year,
                summary: books[0].summary,
                publisher: books[0].publisher,
                pageCount: books[0].pageCount,
                readPage: books[0].readPage,
                finished: books[0].finished,
                insertedAt: books[0].insertedAt,
                updatedAt: books[0].updatedAt,
                token: req.auth.token,
                session: `${loginUser[0].username}'s Books`
            });
        }
        return h.view('empty', {
            message: `Buku tidak ditemukan`,
            token: req.auth.token,
            session: `${loginUser[0].username}'s Books`
        })
    } catch(e){
        return h.view('empty', {
            message: `${e}`,
            token: req.auth.token,
            session: `${loginUser[0].username}'s Books`
        });
    }
};

const formEditBookHandler = async (req, h) => {
    try {
        const id = req.params.id;
        return h.view('form-edit-book', {
            id,
            token: req.auth.token,
            session: `${loginUser[0].username}'s Books`
        });

    } catch(e){
        return h.view('empty', {
            message: `${e}`,
            token: req.auth.token,
            session: `${loginUser[0].username}'s Books`
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
        const book = createCollection(loginUser[0].username, bookSchema);
        const bookArray = await findAllData(book);
        const index = bookArray.findIndex(book => book._id == id);
        
        if(index != -1){
            if(onlySpaces(name)){
                return h.view('empty', {
                    message: `Nama Buku tidak Boleh Hanya Whitespace`,
                    token: req.auth.token,
                    session: `${loginUser[0].username}'s Books`
                });
            } else if(parseInt(readPage) > parseInt(pageCount)){
                return h.view('empty', {
                    message: `readPage tidak boleh lebih besar dari pageCount`,
                    token: req.auth.token,
                    session: `${loginUser[0].username}'s Books`
                });
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
                token: req.auth.token,
                session: `${loginUser[0].username}'s Books`
            });
        } else{
            return h.view('empty', {
                message: `Gagal memperbarui buku. Id tidak ditemukan`,
                token: req.auth.token,
                session: `${loginUser[0].username}'s Books`
            });
        }
        
    } catch(e){
        return h.view('empty', {
            message: `${e}`,
            token: req.auth.token,
            session: `${loginUser[0].username}'s Books`
        });
    }
};

const deleteValidationHandler = async (req, h) => {
    try {
        const id = req.params.id;
        return h.view('validation-delete-book', {
            id,
            token: req.auth.token,
            session: `${loginUser[0].username}'s Books`
        });
    } catch(e){
        return h.view('empty', {
            message: `${e}`,
            token: req.auth.token,
            session: `${loginUser[0].username}'s Books`
        });
    }
};

const deleteBookByIdHandler = async (req, h) => {
    try{
        const {id} = req.params;
        const data = req.payload;
        const book = createCollection(loginUser[0].username, bookSchema);
        const bookArray = await findAllData(book);
        const index = bookArray.findIndex(book => (book._id == id) && (id == data.id));

        if(index != -1){
            book.deleteOne({_id: bookArray[index].id}, (err, doc) => {
                if(err){
                    console.log(err);
                }
                console.log("Deleted doc: ", doc);
            })
            const deletedAt = new Date().toString();
            bookArray[index].updatedAt = deletedAt
            return h.view('empty', {
                message: `"${bookArray[index].name}" Berhasil dihapus ${deletedAt}`,
                token: req.auth.token,
                session: `${loginUser[0].username}'s Books`
            });
        } else{
            return h.view('empty', {
                message: `Buku gagal dihapus. Id yang anda masukan tidak sesuai`,
                token: req.auth.token,
                session: `${loginUser[0].username}'s Books`
            });
        }
    } catch(e){
        return h.view('empty', {
            message: `${e}`,
            token: req.auth.token,
            session: `${loginUser[0].username}'s Books`
        });
    }
};

const logoutHandler = (req, h) => {
    for(let i=0; i<=loginUser.length; i++){
        loginUser.splice(deleteCount=i);
    }
    return h.redirect('/');
}

module.exports = {logoutHandler, signInHandler, formSignInHandler, mainPageHandler, signUpHandler, formSignUpHandler, formAddBookHandler, addBookHandler, getAllBooksHandler, getBookByIdHandler, formEditBookHandler, editBookByIdHandler, deleteValidationHandler, deleteBookByIdHandler};
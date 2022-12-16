const {existingBook, findAllData, Book} = require('./checkBook');

// const handlerFunc = (h, status = undefined, message = undefined, httpCode = undefined, data = undefined) => {
    //     const response = h.response({
//         status: status,
//         message: message,
//         data: data,
//     });
//     response.code(httpCode);
//     return response;
// };

const onlySpaces = (str) => {
    return str.trim().length === 0;
};

// Route Handler
const getAllBooksHandler = async (req, h) => {
    try{
        const bookArray = await findAllData();
        // if(bookArray.length > 0){
        // }
        return h.view('all-book', {
            bookArray
        });
    } catch(e){
        return h.view('empty', {message: `${e}`});
    }
};

const formAddBookHandler = async (req, h) => {
    try {
        return h.view('form-book', {});

    } catch(e){
        return h.view('empty', {message: `${e}`});
    }
};

const addBookHandler = async (req, h) => {
    try{
        // // Mengambil nilai dari masing-masing property
        const data = req.payload;
        const {name, year, author, summary, publisher, pageCount, readPage} = data;
        const finished = (pageCount === readPage) ? true:false;
        const insertedAt = new Date().toString();
        const updatedAt = insertedAt;

        // Menggabungkan ke dalam satu json object newBook
        const newBook = {
            name, year, author, summary, publisher, pageCount, readPage, finished, insertedAt, updatedAt
        };
        const book = new Book(newBook);

        // duplikat && string name whitespace? save:don't
        const filterBook = {
            name: name,
            year: year,
            author: author
        };
        const id = await existingBook(filterBook);
        if(id === null){
            if(onlySpaces(name)){
                return h.view('empty', {message: `Nama Buku tidak Boleh Hanya Whitespace`});
                // const whiteSpaceBookName = handlerFunc(h, 'fail', 'Nama Buku tidak Boleh Hanya Whitespace', 400);
                // return whiteSpaceBookName;
            } else if(parseInt(readPage) > parseInt(pageCount)){
                return h.view('empty', {message: `Read Page tidak Boleh Lebih dari Page Count`});
            }
            await book.save();
            return h.view('add-book', {data: `${name} berhasil ditambahkan`})

        } else{
            return h.view('add-book', {data: `Buku ${name} sudah ada`})
        }
    } catch(e){
        return h.view('empty', {message: `${e}`});
    }
};

const getBookByIdHandler = async (req, h) => {
    try{
        const {id} = req.params;
        const bookArray = await findAllData();
        const books = bookArray.filter(book => book._id == id);
        if(books.length > 0){
            // const bookInfo = handlerFunc(h, 'success', undefined, 200, {
            //     id: books[0].id,
            //     name: books[0].name,
            //     year: books[0].year,
            //     author: books[0].author
            // });
            // return bookInfo;
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
                updatedAt: books[0].updatedAt
            });
        }
        return h.view('empty', {message: `Buku tidak ditemukan`})
        // const bookInfo = handlerFunc(h, 'fail', 'Buku tidak ditemukan', 404);
        // return bookInfo;
    } catch(e){
        return h.view('empty', {message: `${e}`});
    }
};

const formEditBookHandler = async (req, h) => {
    try {
        const id = req.params.id;
        return h.view('form-edit-book', {id});

    } catch(e){
        return h.view('empty', {message: `${e}`});
    }
}

const editBookByIdHandler = async (req, h) => {
    try{
        const {id} = req.params;
        const data = req.payload;
        const {name, year, author, summary, publisher, pageCount, readPage} = data;
        const updatedAt = new Date().toString();
        const finished = (pageCount === readPage) ? true:false;
        const bookArray = await findAllData();
        const index = bookArray.findIndex(book => book._id == id);
        
        if(index != -1){
            if(onlySpaces(name)){
                // const whiteSpaceBookName = handlerFunc(h, 'fail', 'Nama Buku tidak Boleh Hanya Whitespace', 400);
                // return whiteSpaceBookName;
                return h.view('empty', {message: `Nama Buku tidak Boleh Hanya Whitespace`});
            } else if(parseInt(readPage) > parseInt(pageCount)){
                // const pageNumber = handlerFunc(h, 'fail', 'readPage tidak boleh lebih besar dari pageCount', 400);
                // return pageNumber;
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
            return h.view('edit-book', {
                message: `Buku ${bookArray[index].name} Berhasil Diupdate`
            });
        } else{
            return h.view('empty', {message: `Gagal memperbarui buku. Id tidak ditemukan`});
            // const errorId = handlerFunc(h, 'fail', 'Gagal memperbarui buku. Id tidak ditemukan', 404);
            // return errorId;
        }
        
    } catch(e){
        return h.view('empty', {message: `${e}`});
    }
};

const deleteValidation = async (req, h) => {
    try {
        const id = req.params.id;
        return h.view('validation-delete-book', {id});
    } catch(e){
        return h.view('empty', {message: `${e}`});
    }
};

const deleteBookByIdHandler = async (req, h) => {
    try{
        const {id} = req.params;
        const data = req.payload;
        const bookArray = await findAllData();
        const index = bookArray.findIndex(book => (book._id == id) && (id == data.id));
        if(index != -1){
            // Delete mongodb document id
            Book.deleteOne({_id: bookArray[index].id}, (err, doc) => {
                if(err){
                    console.log(err);
                }
                console.log("Deleted doc: ", doc);
            })
            const deletedAt = new Date().toString();
            bookArray[index].updatedAt = deletedAt
            return h.view('delete-book', {
                message: `"${bookArray[index].name}" Berhasil dihapus ${deletedAt}`
            });
        } else{
            return h.view('empty', {message: `Buku gagal dihapus. Id yang anda masukan tidak sesuai`});
            // const errorDelete = handlerFunc(h, 'fail', 'Buku gagal dihapus. Id yang anda masukan tidak sesuai', 404);
            // return errorDelete;
        }
    } catch(e){
        return h.view('empty', {message: `${e}`});
    }
};

module.exports = {formAddBookHandler, addBookHandler, getAllBooksHandler, getBookByIdHandler, formEditBookHandler, editBookByIdHandler, deleteValidation, deleteBookByIdHandler};
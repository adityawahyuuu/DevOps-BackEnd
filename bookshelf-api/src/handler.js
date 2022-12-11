const {existingBook, findAllData, Book} = require('./checkBook');

const onlySpaces = (str) => {
    return str.trim().length === 0;
};

const handlerFunc = (h, status, message = undefined, httpCode, data = undefined) => {
    const response = h.response({
        status: status,
        message: message,
        data: data,
    });
    response.code(httpCode);
    return response;
};

const addBookHandler = async (req, h) => {
    try {
        // Mengambil nilai dari masing-masing property
        const {name, year, author, summary, publisher, pageCount, readPage} = req.payload;
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
                const whiteSpaceBookName = handlerFunc(h, 'fail', 'Nama Buku tidak Boleh Hanya Whitespace', 400);
                return whiteSpaceBookName;
            }
            await book.save();
            const bookNew = handlerFunc(h, 'success', 'Buku berhasil ditambahkan', 201);
            return bookNew;
        } else{
            const bookExist = handlerFunc(h, 'fail', 'Buku sudah ada', 500);
            return bookExist;
        }

    } catch(e){
        const errorHandling = handlerFunc(h, 'error', e, 404);
        return errorHandling;
    }
};

const getAllBooksHandler = async (req, h) => {
    try{
        const bookArray = await findAllData();
        if(bookArray.length > 0){
            const allBook = handlerFunc(h, 'exist', undefined, 201, {
                books: bookArray.map(book => ({
                    id: book._id,
                    name: book.name,
                    year: book.year,
                    author: book.author
                }))
            });
            return allBook
        }
        const noneBook = handlerFunc(h, 'none', 'Buku tidak ada', 400);
        return noneBook;
    } catch(e){
        console.log(e);
    }
};

const getBookByIdHandler = async (req, h) => {
    try{
        const {id} = req.params;
        const bookArray = await findAllData();
        const books = bookArray.filter(book => book._id == id);
        if(books.length > 0){
            const bookInfo = handlerFunc(h, 'success', undefined, 200, {
                id: books[0].id,
                name: books[0].name,
                year: books[0].year,
                author: books[0].author
            });
            return bookInfo;
        }
        const bookInfo = handlerFunc(h, 'fail', 'Buku tidak ditemukan', 404);
        return bookInfo;
    } catch(e){
        console.log(e);
    }
};

const editBookByIdHandler = async (req, h) => {
    try{
        const {id} = req.params;
        const {name, year, author, summary, publisher, pageCount, readPage, reading,} = req.payload;
        const updatedAt = new Date().toString();
        const bookArray = await findAllData();
        const index = bookArray.findIndex(book => book._id == id);
        if(index != -1){
            if(onlySpaces(name)){
                const whiteSpaceBookName = handlerFunc(h, 'fail', 'Nama Buku tidak Boleh Hanya Whitespace', 400);
                return whiteSpaceBookName;
            } else if(readPage > pageCount){
                const pageNumber = handlerFunc(h, 'fail', 'readPage tidak boleh lebih besar dari pageCount', 400);
                return pageNumber;
            }
            const finished = (pageCount === readPage);
            bookArray[index] = {
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                finished,
                reading,
                updatedAt,
            };
            // Update documents
            Book.findOneAndUpdate({id: bookArray[index]._id}, bookArray[index], (err, doc) => {
                if(err){
                    console.log(err);
                }
                console.log("Updated doc: ", doc);
            });
            const successEditingBook = handlerFunc(h, 'success', 'Buku berhasil diperbarui', 200);
            return successEditingBook;
        } else{
            const errorId = handlerFunc(h, 'fail', 'Gagal memperbarui buku. Id tidak ditemukan', 404);
            return errorId;
        }

    } catch(e){
        console.log(e);
    }
};

const deleteBookByIdHandler = async (req, h) => {
    try{
        const {id} = req.params;
        const bookArray = await findAllData();
        const index = bookArray.findIndex(book => book._id == id);
        if(index != -1){
            // Delete mongodb document id
            Book.findOneAndDelete({id: bookArray[index]._id}, (err, doc) => {
                if(err){
                    console.log(err);
                }
                console.log("Deleted doc: ", doc);
            })
            const deletedAt = new Date().toString();
            bookArray[index].updatedAt = deletedAt
            const deleteBook = handlerFunc(h, 'success', 'Buku berhasil dihapus', 200, bookArray[index]);
            return deleteBook;
        } else{
            const errorDelete = handlerFunc(h, 'fail', 'Buku gagal dihapus. Id tidak ditemukan', 404);
            return errorDelete;
        }
    } catch(e){
        console.log(e);
    }
}

module.exports = {addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};
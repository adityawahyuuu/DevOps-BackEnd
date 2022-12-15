const {formAddBookHandler, addBookHandler, getAllBooksHandler, getBookByIdHandler, formEditBookHandler, editBookByIdHandler, deleteValidation, deleteBookByIdHandler} = require('./handler');

const routes = [
    {
        method: 'GET',
        path: '/',
        handler: getAllBooksHandler
    },
    {
        method: 'GET',
        path: '/book',
        handler: formAddBookHandler
    },
    {
        method: 'POST',
        path: '/book',
        handler: addBookHandler
    },
    {
        method: 'GET',
        path: '/book/{id}',
        handler: getBookByIdHandler
    },
    {
        method: 'GET',
        path: '/book/{id}/edit',
        handler: formEditBookHandler
    },
    {
        method: 'POST',
        path: '/book/{id}/edit',
        handler: editBookByIdHandler
    },
    {
        method: 'GET',
        path: '/book/{id}/delete',
        handler: deleteValidation
    },
    {
        method: 'POST',
        path: '/book/{id}/delete',
        handler: deleteBookByIdHandler
    }
];

module.exports = routes;
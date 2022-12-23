const {logoutHandler, signInHandler, formSignInHandler, mainPageHandler, signUpHandler, formSignUpHandler, formAddBookHandler, addBookHandler, getAllBooksHandler, getBookByIdHandler, formEditBookHandler, editBookByIdHandler, deleteValidationHandler, deleteBookByIdHandler} = require('./handler');

const routes = [
    {
        method: 'GET',
        path: '/',
        config: { auth: false }, 
        handler: mainPageHandler
    },
    {
        method: 'GET',
        path: '/signup',
        config: { auth: false }, 
        handler: formSignUpHandler
    },
    {
        method: 'POST',
        path: '/signup',
        config: { auth: false }, 
        handler: signUpHandler
    },
    {
        method: 'GET',
        path: '/signin',
        config: { auth: false }, 
        handler: formSignInHandler
    },
    {
        method: 'POST',
        path: '/signin',
        config: { auth: false }, 
        handler: signInHandler
    },

    // Routes dibawah harus menerapkan authentikasi
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler,
    },
    {
        method: 'GET',
        path: '/book',
        handler: formAddBookHandler,
    },
    {
        method: 'POST',
        path: '/book',
        handler: addBookHandler,
    },
    {
        method: 'GET',
        path: '/book/{id}',
        handler: getBookByIdHandler,
    },
    {
        method: 'GET',
        path: '/book/{id}/edit',
        handler: formEditBookHandler,
    },
    {
        method: 'POST',
        path: '/book/{id}/edit',
        handler: editBookByIdHandler,
    },
    {
        method: 'GET',
        path: '/book/{id}/delete',
        handler: deleteValidationHandler,
    },
    {
        method: 'POST',
        path: '/book/{id}/delete',
        handler: deleteBookByIdHandler,
    },
    {
        method: 'GET',
        path: '/logout',
        handler: logoutHandler
    }
];

module.exports = routes;
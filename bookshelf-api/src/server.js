const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const ejs = require('ejs');
const routes = require('./routes');
require('./db');

const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register(Vision);
    server.views({
        engines: {ejs: ejs},
        relativeTo: 'D:/practice/DevOps-BackEnd/bookshelf-api'
    });

    server.route(routes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
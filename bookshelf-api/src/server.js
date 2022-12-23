const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const hapiJwtAuth = require('hapi-auth-jwt2');
const ejs = require('ejs');
const routes = require('./routes');
const secret = require('./config');
require('./db');

const plugin = [Vision, hapiJwtAuth];
const validate = async (decoded, request, h) => {
    if (decoded.username == undefined) {
        return { isValid: false };
    }
    else {
        return { isValid: true };
    }
}

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
    await server.register(plugin);
    server.auth.strategy('jwt', 'jwt',{
        key: secret,
        validate,
        verifyOptions: { algorithms: [ 'HS256' ] }, // only allow HS256 algorithm
    });
    server.auth.default('jwt');
    server.views({
        engines: {ejs: ejs},
        relativeTo: 'D:/practice/DevOps-BackEnd/bookshelf-api'
    });

    server.route(routes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
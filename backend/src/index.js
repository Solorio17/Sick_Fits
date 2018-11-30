require('dotenv').config({ path: 'variables.env'});
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

//TODO use express middleware to handle cookies (JWT)
//TODO use express middleware to populate current user


//allow this endpoint to be visited from approved urls
server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL, //same port frontend runs on
    }
}, success => {
    console.log(`Server is now running on port http://localhost:${success.port}`)
})
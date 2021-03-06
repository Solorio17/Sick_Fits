require('dotenv').config({ path: 'variables.env'});
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

//use express middleware to handle cookies (JWT)
server.express.use(cookieParser());

//use express middleware to populate current user
//decode JWT to pair userId with cookie on each request
server.express.use((req, res, next) => {
    const { token } = req.cookies;
    if(token){
        const {userId} = jwt.verify(token, process.env.APP_SECRET);
        //put userId onto the req for future requests to access
        req.userId = userId
    }
    next();
});

//2. Populate the user on each request
server.express.use(async (req, res, next) => {
    //if they're not logged in skip this.
    if(!req.userId) return next();
    const user = await db.query.user({ where: {id: req.userId }}, '{ id, permissions, email, name }');
    req.user = user;
    next();
});

//allow this endpoint to be visited from approved urls
//Start it!
server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL, //same port frontend runs on
    }
}, success => {
    console.log(`Server is now running on port http://localhost:${success.port}`)
})
const { Prisma } = require('prisma-binding');

//create db
const db = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRIMSA_SECRET,
    debug: false,
})

module.exports = db;

//This file connects to the remote prisma DB and gives use the ablilty to query it with
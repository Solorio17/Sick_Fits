const { GraphQLServer } = require('graphql-yoga');
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const db = require('./db');

//Create the graphql yoga server
function createServer(){
    return new GraphQLServer({
        typeDefs: 'src/schema.graphql',
        resolvers: {
            Mutation: Mutation,
            Query: Query
        },
        resolverValidationOptions: {
            requireResolversForResolveType: false //error fix
        },
        context: req => ({ ...req, db }) //allow access the DB from the resolvers, (passed via context)
    });
}

module.exports = createServer;
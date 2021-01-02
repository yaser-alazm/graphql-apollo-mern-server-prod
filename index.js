const {apolloServer, ApolloServer} = require('apollo-server')
const mongoose = require('mongoose')
const env = require('dotenv');

env.config({ path: './.env' });

// const {MONGO_URL, PORT} = require('./config')
const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs')

const port = process.env.PORT || 5000

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req})
})

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('MongoDB Connected!');
    server.listen({port})
    .then(res => console.log(`Server is running on ${res.url}`)).catch(err => console.log(err))
}).catch(err => console.log(err))
